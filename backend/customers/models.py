from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
from cryptography.fernet import Fernet
import base64

def get_fernet():
    key = settings.SECRET_KEY[:32].encode('utf-8').ljust(32, b'A')
    return Fernet(base64.urlsafe_b64encode(key))

class EncryptedCharField(models.CharField):
    def get_prep_value(self, value):
        value = super().get_prep_value(value)
        if value:
            return get_fernet().encrypt(value.encode()).decode()
        return value

    def from_db_value(self, value, expression, connection):
        if value:
            try:
                return get_fernet().decrypt(value.encode()).decode()
            except Exception:
                return value
        return value

class EncryptedEmailField(models.EmailField, EncryptedCharField):
    pass

User = get_user_model()

class Customer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customers')
    name = models.CharField(max_length=255)
    phone = EncryptedCharField(max_length=255)
    email = EncryptedEmailField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
