from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import SubscriptionPayment
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime, timedelta
import os
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired

signer = TimestampSigner()

User = get_user_model()

from rest_framework.exceptions import ValidationError as DRFValidationError
import logging
from .validators import SignupSchema, LoginSchema
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        schema = SignupSchema(data=request.data)
        if not schema.is_valid():
            logger.warning(f"Registration validation failed: {schema.errors}")
            return Response(
                {"error": "Invalid input provided. Please check your details and try again."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        validated_data = schema.validated_data
        serializer = self.get_serializer(data=validated_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        schema = LoginSchema(data=request.data)
        if not schema.is_valid():
            logger.warning(f"Login validation failed: {schema.errors}")
            return Response(
                {"error": "Invalid credentials provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        validated_data = schema.validated_data
        serializer = self.get_serializer(data=validated_data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            logger.warning(f"Login authentication failed: {str(e)}")
            return Response(
                {"error": "Invalid credentials provided."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class SubscriptionUpgradeView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        tier = request.data.get('tier')
        phone_number = request.data.get('phone_number')
        
        prices = {
            'Starter': 499,
            'Professional': 1500,
            'Business': 3500
        }
        
        if tier not in prices:
            return Response({"error": "Invalid tier"}, status=status.HTTP_400_BAD_REQUEST)
            
        amount = prices[tier]
        reference = f"SUB-{request.user.id}-{int(datetime.now().timestamp())}"
        
        payment = SubscriptionPayment.objects.create(
            user=request.user,
            tier=tier,
            amount=amount,
            phone_number=phone_number,
            reference=reference
        )
        
        # Import dynamically to avoid circular imports or early app loading issues
        from payments.payhero import initiate_payhero_stk_push
        try:
            payhero_resp = initiate_payhero_stk_push(phone_number, amount, reference)
            payment.raw_response = str(payhero_resp)
            
            # PayHero returns success=True if STK push was initiated
            if payhero_resp.get('success'):
                payment.save()
                return Response({"message": "STK Push initiated successfully. Please check your phone."})
            else:
                payment.status = 'Failed'
                payment.save()
                return Response({"error": "Failed to initiate STK Push", "details": payhero_resp}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            payment.status = 'Failed'
            payment.raw_response = str(e)
            payment.save()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PayHeroCallbackView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        
        # Handle various PayHero callback structures
        status_val = data.get('status')
        reference = data.get('external_reference')
        
        if not reference:
            response_data = data.get('response', {})
            reference = response_data.get('external_reference')
            status_val = response_data.get('status') or data.get('status')
            
        if not reference:
            return Response({"error": "No reference provided"}, status=status.HTTP_400_BAD_REQUEST)
            
        payment = SubscriptionPayment.objects.filter(reference=reference).first()
        if not payment:
            return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
            
        if status_val in ['Success', 'Completed', 'SUCCESS']:
            payment.status = 'Completed'
            payment.completed_at = timezone.now()
            payment.save()
            
            # Upgrade user
            user = payment.user
            user.subscription_tier = payment.tier
            current_end = user.subscription_end_date or timezone.now()
            if current_end < timezone.now():
                current_end = timezone.now()
            user.subscription_end_date = current_end + timedelta(days=30)
            user.save()
            
        else:
            payment.status = 'Failed'
            payment.save()
            
        return Response({"message": "Callback processed"})

class GoogleLoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', getattr(settings, 'GOOGLE_CLIENT_ID', ''))
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), CLIENT_ID)

            email = idinfo.get('email')
            name = idinfo.get('name')
            
            if not email:
                return Response({"error": "Google token does not contain an email."}, status=status.HTTP_400_BAD_REQUEST)

            user, created = User.objects.get_or_create(email=email, defaults={
                'username': email.split('@')[0],
                'first_name': name.split(' ')[0] if name else '',
                'last_name': ' '.join(name.split(' ')[1:]) if name and ' ' in name else ''
            })

            if not user.is_active:
                return Response({"error": "User account is disabled."}, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })

        except ValueError as e:
            print("Google Auth Error:", str(e))
            return Response({"error": f"Invalid token: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

class RequestPasswordResetView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email__iexact=email).first()
        if user:
            token = signer.sign(str(user.id))
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173').rstrip('/')
            reset_link = f"{frontend_url}/reset-password?token={token}"
            
            send_mail(
                'Password Reset for QuickQuote Pro',
                f'Click the link to reset your password: {reset_link}',
                getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@quickquotepro.online'),
                [user.email],
                fail_silently=False,
            )
        
        return Response({"message": "If an account with that email exists, we have sent a password reset link."})

class ConfirmPasswordResetView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('password')
        
        if not token or not new_password:
            return Response({"error": "Token and new password are required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user_id = signer.unsign(token, max_age=3600)
            user = User.objects.get(id=user_id)
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password has been reset successfully."})
        except SignatureExpired:
            return Response({"error": "Password reset link has expired."}, status=status.HTTP_400_BAD_REQUEST)
        except BadSignature:
            return Response({"error": "Invalid password reset link."}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User no longer exists."}, status=status.HTTP_400_BAD_REQUEST)

from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncMonth
from quotes.models import Quote
from invoices.models import Invoice
from dateutil.relativedelta import relativedelta

class DashboardStatsView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        
        # Quotes stats
        quotes = Quote.objects.filter(customer__user=user)
        total_quotes = quotes.count()
        accepted_quotes = quotes.filter(status__in=['Accepted', 'Approved']).count()
        pending_quotes = quotes.filter(status__in=['Draft', 'Sent', 'Viewed']).count()
        
        conversion_rate = (accepted_quotes / total_quotes * 100) if total_quotes > 0 else 0
        
        # Invoices stats
        invoices = Invoice.objects.filter(customer__user=user)
        invoices_sent = invoices.count()
        
        # Revenue (Paid invoices)
        revenue = invoices.filter(status='Paid').aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        
        # Outstanding (Unpaid or Partially Paid)
        outstanding = invoices.filter(status__in=['Unpaid', 'Partially Paid']).aggregate(Sum('total'))['total__sum'] or 0
        outstanding_paid = invoices.filter(status__in=['Unpaid', 'Partially Paid']).aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0
        outstanding_balance = outstanding - outstanding_paid
        
        # Monthly Revenue Chart (Last 6 months)
        six_months_ago = timezone.now() - relativedelta(months=6)
        monthly_revenue = invoices.filter(
            status='Paid', 
            created_at__gte=six_months_ago
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            total=Sum('amount_paid')
        ).order_by('month')
        
        chart_data = []
        for entry in monthly_revenue:
            chart_data.append({
                'month': entry['month'].strftime('%b %Y'),
                'revenue': float(entry['total'])
            })
            
        return Response({
            'total_quotes': total_quotes,
            'accepted_quotes': accepted_quotes,
            'pending_quotes': pending_quotes,
            'invoices_sent': invoices_sent,
            'revenue': float(revenue),
            'outstanding_payments': float(outstanding_balance),
            'conversion_rate': round(conversion_rate, 1),
            'monthly_revenue': chart_data
        })
