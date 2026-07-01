import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from customers.models import Customer, get_fernet
import traceback

c = Customer.objects.first()
print("Phone in DB:", c.phone)

try:
    decrypted = get_fernet().decrypt(c.phone.encode()).decode()
    print("Successfully decrypted:", decrypted)
except Exception as e:
    print("Decryption failed!")
    traceback.print_exc()
