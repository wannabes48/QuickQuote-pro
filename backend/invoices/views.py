from django.http import HttpResponse
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from .models import Invoice
from .serializers import InvoiceSerializer
from .pdf_service import generate_invoice_pdf

class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Invoice.objects.filter(customer__user=self.request.user)

    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        invoice = self.get_object()
        buffer = generate_invoice_pdf(invoice)
        
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Invoice_{invoice.invoice_number}.pdf"'
        return response
