import requests
import base64
import os
from django.conf import settings

def initiate_payhero_stk_push(phone_number, amount, reference):
    username = getattr(settings, 'PAYHERO_USERNAME', os.environ.get('PAYHERO_USERNAME'))
    password = getattr(settings, 'PAYHERO_PASSWORD', os.environ.get('PAYHERO_PASSWORD'))
    channel_id = getattr(settings, 'PAYHERO_CHANNEL_ID', os.environ.get('PAYHERO_CHANNEL_ID', '123'))
    api_url = getattr(settings, 'PAYHERO_API_URL', os.environ.get('PAYHERO_API_URL', 'https://backend.payhero.co.ke/api/v2/payments'))
    
    # Callback URL should be your production URL
    # For now, we will construct a default or rely on the environment
    base_url = getattr(settings, 'FRONTEND_URL', 'https://backend.quickquotepro.online')
    if base_url.endswith('/'):
        base_url = base_url[:-1]
    callback_url = f"{base_url}/api/users/subscription/callback/"
    
    # Create Basic Auth header
    credentials = f"{username}:{password}"
    base64_credentials = base64.b64encode(credentials.encode()).decode()
    
    headers = {
        "Authorization": f"Basic {base64_credentials}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "amount": amount,
        "phone_number": phone_number,
        "channel_id": int(channel_id),
        "provider": "m-pesa",
        "external_reference": reference,
        "callback_url": callback_url
    }
    
    try:
        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        error_msg = str(e)
        if e.response is not None:
            error_msg += f" - Response: {e.response.text}"
        raise Exception(f"PayHero STK Push failed: {error_msg}")
