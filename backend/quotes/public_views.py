from rest_framework import views, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Quote, QuoteAuditLog
from .serializers import QuoteSerializer
from django.utils import timezone

class PublicQuoteView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        quote = get_object_or_404(Quote, public_token=token)
        serializer = QuoteSerializer(quote)
        
        # Log view
        if quote.status == 'Sent':
            quote.status = 'Viewed'
            quote.save()
            QuoteAuditLog.objects.create(
                quote=quote,
                action='Viewed by Customer',
                details='Customer opened the public link'
            )
            
        return Response(serializer.data)

    def post(self, request, token):
        # Handle signature submission
        quote = get_object_or_404(Quote, public_token=token)
        signature = request.data.get('signature_data')
        
        if not signature:
            return Response({'error': 'Signature data is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        quote.signature_data = signature
        quote.signed_at = timezone.now()
        quote.status = 'Accepted'
        quote.save()
        
        QuoteAuditLog.objects.create(
            quote=quote,
            action='Accepted',
            details='Customer signed and accepted the quote'
        )
        
        return Response({'message': 'Quote accepted successfully'})
