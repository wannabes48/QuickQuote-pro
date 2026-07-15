import logging
from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import datetime
from decimal import Decimal
from .models import Payment
from invoices.models import Invoice
from .serializers import PaymentSerializer
from .services import initiate_payhero_stk, generate_lipwa_payment_link

logger = logging.getLogger(__name__)


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Payment.objects.filter(invoice__customer__user=self.request.user)
        invoice_id = self.request.query_params.get('invoice_id')
        if invoice_id:
            queryset = queryset.filter(invoice_id=invoice_id)
        return queryset

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def initiate(self, request):
        """Initiate an M-Pesa STK Push payment via PayHero."""
        invoice_id = request.data.get('invoice_id')
        phone_number = request.data.get('phone_number')

        if not invoice_id or not phone_number:
            return Response(
                {'error': 'invoice_id and phone_number are required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        invoice = get_object_or_404(Invoice, id=invoice_id)
        amount_due = invoice.total - invoice.amount_paid

        if amount_due <= 0:
            return Response(
                {'error': 'Invoice is already paid'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reference = f"INV-{invoice.invoice_number}-{int(datetime.now().timestamp())}"
        payment = Payment.objects.create(
            invoice=invoice,
            amount=amount_due,
            phone_number=phone_number,
            method='M-Pesa STK',
            transaction_id=reference,
        )

        try:
            stk_response = initiate_payhero_stk(phone_number, amount_due, reference)
            payment.raw_response = str(stk_response)
            payment.save()
            return Response({'message': 'M-Pesa payment prompt sent successfully'})
        except Exception as e:
            payment.status = 'Failed'
            payment.raw_response = str(e)
            payment.save()
            logger.error(f'STK Push failed for invoice {invoice.invoice_number}: {e}')
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def record(self, request):
        """Manually record a payment."""
        data = request.data
        invoice_id = data.get('invoice_id')
        amount = data.get('amount')
        
        if not invoice_id or not amount:
            return Response(
                {'error': 'invoice_id and amount are required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            amount = Decimal(str(amount))
        except (ValueError, TypeError, Exception):
            return Response({'error': 'Invalid amount format'}, status=status.HTTP_400_BAD_REQUEST)

        invoice = get_object_or_404(Invoice, id=invoice_id)
        amount_due = invoice.total - invoice.amount_paid

        if amount <= 0:
            return Response({'error': 'Amount must be greater than zero'}, status=status.HTTP_400_BAD_REQUEST)

        # Allow full payment or partial payment. Only warn on overpayment if strictly enforced.
        if amount > amount_due:
            return Response({'error': f'Payment exceeds outstanding balance of {amount_due}'}, status=status.HTTP_400_BAD_REQUEST)

        method = data.get('method', 'Other')
        reference = data.get('reference_number', f"MANUAL-{invoice.invoice_number}-{int(datetime.now().timestamp())}")
        
        payment_date = data.get('payment_date')
        if not payment_date:
            payment_date = timezone.now().date()
            
        payment = Payment.objects.create(
            invoice=invoice,
            amount=amount,
            method=method,
            transaction_id=reference,
            reference_number=data.get('reference_number', ''),
            payment_date=payment_date,
            notes=data.get('notes', ''),
            deposit_type=data.get('deposit_type', ''),
            status='Completed',
            completed_at=timezone.now()
        )
        
        # Update invoice
        invoice.amount_paid += payment.amount
        if invoice.amount_paid >= invoice.total:
            invoice.status = 'Paid'
        else:
            invoice.status = 'Partially Paid'
        invoice.save()
        
        serializer = self.get_serializer(payment)
        return Response({
            'message': 'Payment recorded successfully',
            'payment': serializer.data
        })

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def generate_link(self, request):
        """Generate a PayHero Lipwa payment link for an invoice."""
        invoice_id = request.data.get('invoice_id')

        if not invoice_id:
            return Response(
                {'error': 'invoice_id is required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        invoice = get_object_or_404(Invoice, id=invoice_id)
        amount_due = invoice.total - invoice.amount_paid

        if amount_due <= 0:
            return Response(
                {'error': 'Invoice is already paid'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment_link = generate_lipwa_payment_link(invoice)

        reference = f"LINK-{invoice.invoice_number}-{int(datetime.now().timestamp())}"
        Payment.objects.create(
            invoice=invoice,
            amount=amount_due,
            method='Payment Link',
            payment_link=payment_link,
            transaction_id=reference,
        )

        return Response({
            'payment_link': payment_link,
            'invoice_number': invoice.invoice_number,
        })


class PayHeroCallbackView(views.APIView):
    """Handle PayHero payment callbacks for invoice payments."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        logger.info(f'PayHero callback received: {data}')

        try:
            pay_status = data.get('status', '').upper()
            external_ref = data.get('external_reference', '')
            provider_ref = data.get('provider_reference', '')

            # Find payment by transaction_id (which stores our external_reference)
            payment = Payment.objects.filter(transaction_id=external_ref).first()
            if not payment:
                logger.warning(
                    f'PayHero callback: payment not found for ref {external_ref}'
                )
                return Response(
                    {'error': 'Payment not found'},
                    status=status.HTTP_404_NOT_FOUND,
                )

            payment.raw_response = str(data)

            if pay_status == 'SUCCESS':
                payment.status = 'Completed'
                payment.completed_at = timezone.now()
                if provider_ref:
                    payment.checkout_request_id = provider_ref
                payment.save()

                # Update invoice
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

            return Response({'message': 'Callback processed'})

        except Exception as e:
            logger.error(f'PayHero callback error: {e}')
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


# Keep for backward compatibility
class MpesaCallbackView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        return Response({'message': 'Deprecated — use payhero-callback'})
