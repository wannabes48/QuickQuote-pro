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
    company_logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    company_email = models.EmailField(blank=True, null=True)
    company_address = models.TextField(blank=True, null=True)
    tax_number = models.CharField(max_length=50, blank=True, null=True)
    default_currency = models.CharField(max_length=10, default='KSh')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    subscription_tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='Free')
    subscription_end_date = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.username

class SubscriptionPayment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscription_payments')
    tier = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    phone_number = models.CharField(max_length=20)
    status = models.CharField(max_length=20, default='Pending') # Pending, Completed, Failed
    reference = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    raw_response = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.tier} - {self.status}"
