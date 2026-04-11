from django.db import models
from django.conf import settings

class Transaction(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
    )
    
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='GNF')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    provider_ref = models.CharField(max_length=100, blank=True, null=True, help_text="e.g Paystack Reference")
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.status.upper()} - {self.amount} {self.currency} for Order #{self.order.order_id}"
