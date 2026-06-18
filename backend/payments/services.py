import requests
import base64
from datetime import datetime
from django.conf import settings

def get_mpesa_access_token():
    consumer_key = getattr(settings, 'MPESA_CONSUMER_KEY', 'sandbox_key')
    consumer_secret = getattr(settings, 'MPESA_CONSUMER_SECRET', 'sandbox_secret')
    api_url = getattr(settings, 'MPESA_AUTH_URL', 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials')
    
    r = requests.get(api_url, auth=(consumer_key, consumer_secret))
    if r.status_code == 200:
        return r.json().get('access_token')
    raise Exception('Failed to get M-Pesa access token')

def initiate_stk_push(payment):
    access_token = get_mpesa_access_token()
    api_url = getattr(settings, 'MPESA_STK_URL', 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest')
    headers = {"Authorization": f"Bearer {access_token}"}
    
    business_shortcode = getattr(settings, 'MPESA_SHORTCODE', '174379')
    passkey = getattr(settings, 'MPESA_PASSKEY', 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919')
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    password = base64.b64encode((business_shortcode + passkey + timestamp).encode()).decode('utf-8')
    
    callback_url = getattr(settings, 'MPESA_CALLBACK_URL', 'https://yourdomain.com/api/payments/callback/')
    
    payload = {
        "BusinessShortCode": business_shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(payment.amount),
        "PartyA": payment.phone_number,
        "PartyB": business_shortcode,
        "PhoneNumber": payment.phone_number,
        "CallBackURL": callback_url,
        "AccountReference": payment.invoice.invoice_number,
        "TransactionDesc": f"Payment for Invoice {payment.invoice.invoice_number}"
    }
    
    response = requests.post(api_url, json=payload, headers=headers)
    return response.json()
