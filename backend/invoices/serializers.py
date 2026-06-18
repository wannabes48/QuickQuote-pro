from rest_framework import serializers
from .models import Invoice, InvoiceItem

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'total']
        read_only_fields = ['total']

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    customer_details = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = ['id', 'quote', 'customer', 'customer_details', 'invoice_number', 'status', 'currency', 'subtotal', 'vat', 'total', 'amount_paid', 'notes', 'public_token', 'due_date', 'created_at', 'items']
        read_only_fields = ['subtotal', 'vat', 'total', 'public_token', 'created_at']

    def get_customer_details(self, obj):
        return {"name": obj.customer.name, "phone": obj.customer.phone, "email": obj.customer.email}
