from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)
    customer_name = serializers.CharField(source='invoice.customer.name', read_only=True)
    invoice_total = serializers.DecimalField(source='invoice.total', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'invoice', 'invoice_number', 'customer_name', 'invoice_total', 'amount', 'transaction_id', 'method', 'phone_number', 'payment_link', 'status', 'created_at', 'completed_at', 'reference_number', 'payment_date', 'notes', 'deposit_type']
