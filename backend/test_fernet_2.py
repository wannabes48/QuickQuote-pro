import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from customers.models import Customer
from django.contrib.auth import get_user_model

User = get_user_model()
u = User.objects.first()
if not u:
    u = User.objects.create(username="testuser", email="test@example.com")

print("Creating customer...")
c = Customer.objects.create(user=u, name="Test Fernet", phone="0700123456", email="test@fernet.com")

print("Customer created. In memory phone:", c.phone)

c.refresh_from_db()
print("Customer reloaded from DB. Phone:", c.phone)

c.save()
print("Customer saved again.")

c.refresh_from_db()
print("Customer reloaded again. Phone:", c.phone)

