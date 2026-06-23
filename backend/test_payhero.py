import requests
import base64

username = 'WArg2IoWLBBJDEgqzGtv'
password = 'DTkoek7U4TJWUzHSx3JFmNzUj94Rp1PxNa4dXlCx'
channel_id = 10209
api_url = 'https://backend.payhero.co.ke/api/v2/payments'

credentials = f"{username}:{password}"
base64_credentials = base64.b64encode(credentials.encode()).decode()

headers = {
    "Authorization": f"Basic {base64_credentials}",
    "Content-Type": "application/json"
}

payload = {
    "amount": 10,
    "phone_number": "0712345678",
    "channel_id": channel_id,
    "provider": "m-pesa",
    "external_reference": "TEST-123",
    "callback_url": "https://example.com/callback"
}

response = requests.post(api_url, json=payload, headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
