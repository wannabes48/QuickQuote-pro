from rest_framework import serializers
from .models import Quote, QuoteItem

class QuoteItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteItem
        fields = ('id', 'description', 'quantity', 'unit_price', 'total')
        read_only_fields = ('total',)

class QuoteSerializer(serializers.ModelSerializer):
    items = QuoteItemSerializer(many=True)
    customer_details = serializers.SerializerMethodField()

    class Meta:
        model = Quote
        fields = ['id', 'quote_number', 'customer', 'customer_details', 'status', 'issue_date', 'expiry_date', 'currency', 'subtotal', 'discount', 'vat', 'total', 'notes', 'public_token', 'signature_data', 'signed_at', 'created_at', 'items']
        read_only_fields = ['subtotal', 'vat', 'total', 'public_token', 'signature_data', 'signed_at', 'created_at']

    def get_customer_details(self, obj):
        return {"name": obj.customer.name, "phone": obj.customer.phone, "email": obj.customer.email}

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        quote = Quote.objects.create(**validated_data)
        
        subtotal = 0
        for item_data in items_data:
            item = QuoteItem.objects.create(quote=quote, **item_data)
            subtotal += item.total
        
        from decimal import Decimal
        quote.subtotal = subtotal
        quote.vat = subtotal * Decimal('0.16') # 16% VAT
        quote.total = quote.subtotal + quote.vat
        quote.save()
        return quote
