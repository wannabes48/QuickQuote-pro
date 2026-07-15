from django.db import models
from invoices.models import Invoice


class Payment(models.Model):
    METHOD_CHOICES = [
        ('M-Pesa STK', 'M-Pesa STK'),
        ('Payment Link', 'Payment Link'),
        ('Bank Transfer', 'Bank Transfer'),
        ('Cash', 'Cash'),
        ('Credit Card', 'Credit Card'),
        ('Cheque', 'Cheque'),
        ('Other', 'Other'),
    ]
    
    TYPE_CHOICES = [
        ('Deposit', 'Deposit'),
        ('Partial Payment', 'Partial Payment'),
        ('Final Payment', 'Final Payment'),
        ('Full Payment', 'Full Payment'),
    ]

    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100, unique=True)
    method = models.CharField(max_length=50, choices=METHOD_CHOICES, default='M-Pesa STK')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    payment_link = models.URLField(max_length=500, blank=True, null=True)
    status = models.CharField(max_length=20, default='Pending')  # Pending, Completed, Failed
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    checkout_request_id = models.CharField(max_length=100, blank=True, null=True)
    raw_response = models.TextField(blank=True, null=True)
    
    # Manual Record Fields
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    payment_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    deposit_type = models.CharField(max_length=50, choices=TYPE_CHOICES, blank=True, null=True)

    def __str__(self):
        return f"{self.transaction_id} - {self.amount}"
