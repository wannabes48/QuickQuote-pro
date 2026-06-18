from rest_framework import serializers
from .models import Quote, QuoteItem

class QuoteItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteItem
        fields = ('id', 'description', 'quantity', 'unit_price', 'total')
        read_only_fields = ('total',)

class QuoteSerializer(serializers.ModelSerializer):
    items = QuoteItemSerializer(many=True)

    class Meta:
        model = Quote
        fields = '__all__'
        read_only_fields = ('subtotal', 'vat', 'total', 'created_at')

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
