from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .pdf_service import generate_quote_pdf
from .delivery_service import send_quote_email, send_quote_sms
from .models import Quote
from .serializers import QuoteSerializer

class QuoteViewSet(viewsets.ModelViewSet):
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Quote.objects.filter(customer__user=self.request.user)

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
