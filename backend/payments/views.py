from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Payment
from invoices.models import Invoice
from .serializers import PaymentSerializer
from .services import initiate_stk_push
from datetime import datetime
from django.utils import timezone

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(invoice__customer__user=self.request.user)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def initiate(self, request):
        invoice_id = request.data.get('invoice_id')
        phone_number = request.data.get('phone_number')
        
        invoice = get_object_or_404(Invoice, id=invoice_id)
        amount_due = invoice.total - invoice.amount_paid
        
        if amount_due <= 0:
            return Response({'error': 'Invoice is already paid'}, status=status.HTTP_400_BAD_REQUEST)
            
        payment = Payment.objects.create(
            invoice=invoice,
            amount=amount_due,
            phone_number=phone_number,
            transaction_id=f"TXN-{invoice.id}-{int(datetime.now().timestamp())}"
        )
        
        try:
            stk_response = initiate_stk_push(payment)
            if 'CheckoutRequestID' in stk_response:
                payment.checkout_request_id = stk_response['CheckoutRequestID']
                payment.raw_response = str(stk_response)
                payment.save()
                return Response({'message': 'STK Push initiated successfully'})
            else:
                return Response({'error': 'Failed to initiate STK Push', 'details': stk_response}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MpesaCallbackView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        try:
            body = data.get('Body', {}).get('stkCallback', {})
            result_code = body.get('ResultCode')
            checkout_id = body.get('CheckoutRequestID')
            
            payment = Payment.objects.filter(checkout_request_id=checkout_id).first()
            if not payment:
                return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)
                
            if result_code == 0:
                payment.status = 'Completed'
                payment.completed_at = timezone.now()
                
                # Extract receipt
                callback_metadata = body.get('CallbackMetadata', {}).get('Item', [])
                for item in callback_metadata:
                    if item.get('Name') == 'MpesaReceiptNumber':
                        payment.transaction_id = item.get('Value')
                        break
                
                payment.save()
                
                # Update Invoice
                invoice = payment.invoice
                invoice.amount_paid += payment.amount
                if invoice.amount_paid >= invoice.total:
                    invoice.status = 'Paid'
                else:
                    invoice.status = 'Partially Paid'
                invoice.save()
                
            else:
                payment.status = 'Failed'
                payment.save()
            
            return Response({'message': 'Callback processed successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
