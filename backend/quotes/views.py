from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .pdf_service import generate_quote_pdf
from .delivery_service import send_quote_email, send_quote_sms
from .models import Quote, QuoteAuditLog
from invoices.models import Invoice, InvoiceItem
from .serializers import QuoteSerializer
from users.permissions import CanCreateQuote

class QuoteViewSet(viewsets.ModelViewSet):
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated, CanCreateQuote]

    def get_queryset(self):
        return Quote.objects.filter(customer__user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        if user.subscription_tier in ['Free', 'Starter']:
            quote_count = Quote.objects.filter(customer__user=user).count()
            limit = 50 if user.subscription_tier == 'Starter' else 5
            if quote_count >= limit:
                return Response({'error': f'You have reached your limit of {limit} quotes for the {user.subscription_tier} tier. Please upgrade.'}, status=status.HTTP_403_FORBIDDEN)
        
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        quote = self.get_object()
        buffer = generate_quote_pdf(quote)
        
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Quote_{quote.quote_number}.pdf"'
        return response

    @action(detail=True, methods=['post'])
    def send_quote(self, request, pk=None):
        quote = self.get_object()
        method = request.data.get('method', 'email')
        
        try:
            if method == 'email':
                send_quote_email(quote)
            elif method == 'sms':
                send_quote_sms(quote)
            else:
                return Response({'error': 'Invalid delivery method'}, status=status.HTTP_400_BAD_REQUEST)
                
            quote.status = 'Sent'
            quote.save()
            return Response({'message': f'Quote sent successfully via {method}'})
            
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Failed to send quote', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def convert_to_invoice(self, request, pk=None):
        quote = self.get_object()
        
        if hasattr(quote, 'invoice'):
            return Response({'error': 'Quote already converted to invoice'}, status=status.HTTP_400_BAD_REQUEST)
            
        if quote.status != 'Accepted':
            return Response({'error': 'Quote must be accepted before conversion'}, status=status.HTTP_400_BAD_REQUEST)
            
        invoice = Invoice.objects.create(
            quote=quote,
            customer=quote.customer,
            invoice_number=quote.quote_number.replace('Q', 'INV'),
            subtotal=quote.subtotal,
            vat=quote.vat,
            total=quote.total,
            currency=quote.currency,
            notes=quote.notes
        )
        
        for item in quote.items.all():
            InvoiceItem.objects.create(
                invoice=invoice,
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total=item.total
            )
            
        QuoteAuditLog.objects.create(quote=quote, action='Converted', details=f'Converted to Invoice {invoice.invoice_number}')
        return Response({'message': 'Invoice created successfully', 'invoice_id': invoice.id})

