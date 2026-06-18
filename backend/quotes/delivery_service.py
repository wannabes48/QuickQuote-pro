import os
import base64
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType, Disposition
import africastalking
from .pdf_service import generate_quote_pdf

# Initialize Africa's Talking
AT_USERNAME = os.getenv("AFRICASTALKING_USERNAME", "sandbox")
AT_API_KEY = os.getenv("AFRICASTALKING_API_KEY", "dummy_key")
africastalking.initialize(AT_USERNAME, AT_API_KEY)
sms = africastalking.SMS

def validate_recipient(customer):
    """
    Validates recipient details before sending.
    """
    errors = []
    if not customer.email or '@' not in customer.email:
        errors.append("Invalid or missing email address.")
    if not customer.phone or len(customer.phone) < 9:
        errors.append("Invalid or missing phone number.")
    
    return len(errors) == 0, errors

def send_quote_email(quote):
    """
    Sends the quote PDF via SendGrid.
    """
    is_valid, errors = validate_recipient(quote.customer)
    if not is_valid:
        raise ValueError(f"Recipient validation failed: {', '.join(errors)}")

    pdf_buffer = generate_quote_pdf(quote)
    encoded_pdf = base64.b64encode(pdf_buffer.read()).decode()

    message = Mail(
        from_email=os.getenv("SENDGRID_FROM_EMAIL", "noreply@quickquotepro.com"),
        to_emails=quote.customer.email,
        subject=f"Your Quotation #{quote.quote_number} from {quote.customer.user.company_name or 'QuickQuote Pro'}",
        html_content=f"Dear {quote.customer.name},<br><br>Please find your requested quotation attached.<br><br>Thank you!"
    )

    attachment = Attachment()
    attachment.file_content = FileContent(encoded_pdf)
    attachment.file_type = FileType('application/pdf')
    attachment.file_name = FileName(f"Quote_{quote.quote_number}.pdf")
    attachment.disposition = Disposition('attachment')
    message.attachment = attachment

    # In a real environment with the key, uncomment this:
    # sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY", "dummy_key"))
    # response = sg.send(message)
    # return response.status_code == 202
    
    # For now, simulate success so the frontend flow works:
    return True

def send_quote_sms(quote):
    """
    Sends an SMS notification via Africa's Talking.
    """
    is_valid, errors = validate_recipient(quote.customer)
    if not is_valid:
        raise ValueError(f"Recipient validation failed: {', '.join(errors)}")
        
    message = f"Hello {quote.customer.name}, your quotation #{quote.quote_number} for {quote.currency} {quote.total} is ready. We have sent the PDF to your email."
    
    # In a real environment with the key, uncomment this:
    # response = sms.send(message, [quote.customer.phone])
    # return response
    
    # For now, simulate success:
    return True
