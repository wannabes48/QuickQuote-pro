import bleach
import re
from rest_framework import serializers
import logging

logger = logging.getLogger(__name__)

def sanitize_text(value: str) -> str:
    if not value:
        return value
    # Strip HTML tags using bleach
    cleaned = bleach.clean(value, tags=[], attributes={}, strip=True)
    # Remove potentially dangerous characters
    cleaned = re.sub(r'[<>;=()]', '', cleaned)
    return cleaned.strip()

class SignupSchema(serializers.Serializer):
    username = serializers.CharField(min_length=3, max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, max_length=128)
    company_name = serializers.CharField(max_length=255, required=False, allow_blank=True, default="")
    phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")

    def validate_username(self, value):
        sanitized = sanitize_text(value)
        if not re.match(r'^[a-zA-Z0-9_\.\-]+$', sanitized):
            raise serializers.ValidationError("Username contains invalid characters.")
        return sanitized

    def validate_company_name(self, value):
        return sanitize_text(value)

    def validate_phone_number(self, value):
        return sanitize_text(value)

class LoginSchema(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(min_length=1)
