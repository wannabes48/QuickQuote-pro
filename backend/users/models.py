from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    TIER_CHOICES = [
        ('Free', 'Free'),
        ('Starter', 'Starter'),
        ('Professional', 'Professional'),
        ('Business', 'Business'),
    ]
    company_name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    subscription_tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='Free')
    
    def __str__(self):
        return self.username
