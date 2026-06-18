from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from quotes.models import Quote, QuoteAuditLog
from quotes.delivery_service import send_quote_email

class Command(BaseCommand):
    help = 'Send automated follow-up reminders for quotes sent 3 days ago'

    def handle(self, *args, **options):
        three_days_ago = timezone.now() - timedelta(days=3)
        
        target_quotes = Quote.objects.filter(
            status='Sent',
            created_at__lte=three_days_ago
        )
        
        count = 0
        for quote in target_quotes:
            has_reminder = QuoteAuditLog.objects.filter(quote=quote, action='Reminder Sent').exists()
            if not has_reminder:
                try:
                    # In a production app, we would send a specific reminder template
                    send_quote_email(quote)
                    
                    QuoteAuditLog.objects.create(
                        quote=quote, 
                        action='Reminder Sent', 
                        details='Automated 3-day reminder sent'
                    )
                    count += 1
                    self.stdout.write(self.style.SUCCESS(f'Sent reminder for Quote {quote.quote_number}'))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Failed to send reminder for {quote.quote_number}: {str(e)}'))
                    
        self.stdout.write(self.style.SUCCESS(f'Successfully sent {count} reminders.'))
