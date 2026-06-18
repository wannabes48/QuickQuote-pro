from django.db import models
from customers.models import Customer
from django.contrib.auth import get_user_model
import uuid
from django.contrib.auth import get_user_model

class Quote(models.Model):
    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Sent', 'Sent'),
        ('Viewed', 'Viewed'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='quotes')
    quote_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    vat = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=10, default='KSh')
    notes = models.TextField(blank=True, null=True)
    public_token = models.UUIDField(default=uuid.uuid4, editable=False)
    signature_data = models.TextField(blank=True, null=True)
    signed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quote_number} - {self.customer.name}"

class QuoteItem(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2, blank=True)

    def save(self, *args, **kwargs):
        self.total = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return self.description

class QuoteAuditLog(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='audit_logs')
    user = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=50) # e.g., 'Created', 'Edited', 'Sent', 'Accepted'
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.quote.quote_number} - {self.action} at {self.timestamp}"
