"""
Payment services — PayHero integration for M-Pesa STK Push and Lipwa payment links.

Replaces the broken direct Safaricom Daraja API integration.
PayHero wraps M-Pesa and provides a reliable, unified API.
"""
import os
import base64
import requests
from urllib.parse import urlencode


def _get_payhero_headers():
    """Build PayHero Basic Auth headers from environment credentials."""
    username = os.environ.get('PAYHERO_USERNAME', '')
    password = os.environ.get('PAYHERO_PASSWORD', '')
    credentials = base64.b64encode(f"{username}:{password}".encode()).decode()
    return {
        "Authorization": f"Basic {credentials}",
        "Content-Type": "application/json",
    }


def initiate_payhero_stk(phone_number, amount, reference):
    """
    Initiate an M-Pesa STK Push via PayHero API.

    Sends a payment prompt to the customer's Safaricom phone.
    The customer enters their M-Pesa PIN to complete the payment.
    """
    api_url = os.environ.get(
        'PAYHERO_API_URL', 'https://backend.payhero.co.ke/api/v2/payments'
    )
    channel_id = int(os.environ.get('PAYHERO_CHANNEL_ID', '9643'))
    callback_url = 'https://quickquote-pro.onrender.com/api/payments/payhero-callback/'

    payload = {
        "amount": int(amount),
        "phone_number": phone_number,
        "channel_id": channel_id,
        "provider": "m-pesa",
        "external_reference": reference,
        "callback_url": callback_url,
    }

    try:
        response = requests.post(
            api_url, json=payload, headers=_get_payhero_headers()
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        error_msg = str(e)
        if e.response is not None:
            error_msg += f" - Response: {e.response.text}"
        raise Exception(f"PayHero STK Push failed: {error_msg}")


def generate_lipwa_payment_link(invoice):
    """
    Generate a PayHero Lipwa payment link for an invoice.

    Returns a full URL that the customer can open to pay via
    M-Pesa, bank transfer, or other supported methods.
    """
    lipwa_id = os.environ.get('PAYHERO_LIPWA_ID', '10209')
    channel_id = os.environ.get('PAYHERO_CHANNEL_ID', '9643')
    amount_due = float(invoice.total) - float(invoice.amount_paid)

    params = {
        'amount': int(amount_due),
        'phone': invoice.customer.phone or '',
        'name': invoice.customer.name,
        'channel_id': channel_id,
        'reference': invoice.invoice_number,
        'success_url': 'https://www.quickquotepro.online/payment-success',
        'failed_url': 'https://www.quickquotepro.online/invoices',
    }

    return f"https://lipwa.link/{lipwa_id}?{urlencode(params)}"
