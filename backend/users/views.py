from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import SubscriptionPayment
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime, timedelta

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

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
