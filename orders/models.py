from django.conf import settings
import uuid
from django.db import models
from users.models import TailorProfile
from designs.models import Design

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('in_progress', 'In progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders_made')
    tailor = models.ForeignKey(TailorProfile, on_delete=models.CASCADE, related_name='tailor_orders')
    design = models.ForeignKey(Design, on_delete=models.SET_NULL, null=True, related_name='orders', blank=True)
    measurements = models.ForeignKey('measurements.MeasurementProfile', on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    image_reference = models.ImageField(upload_to='orders/images/', blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    #details = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    #due_date = models.DateField(null=True, blank=True)
      
    def __str__(self):
        return f"Order #{self.order_id} - {self.client.username} → {self.tailor.user.username}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    design = models.ForeignKey(Design, on_delete=models.SET_NULL, null=True, blank=True)
    #item_description = models.TextField()
    quantity = models.PositiveIntegerField(default=1)
    
    # New fields for Split Sizing and Custom Measurements
    size_selection = models.JSONField(default=dict, blank=True, help_text="e.g. {'Jacket': 'L', 'Pants': 'M'}")
    custom_measurements = models.JSONField(default=dict, blank=True, help_text="e.g. {'Chest': 44, 'Waist': 32}")
    
    #price_per_item = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def item_subtotal(self):
        if self.design and self.design.price:
            return self.quantity * self.design.price
        return 0
    def __str__(self):
        return f"{self.quantity} x {self.design.name} for Order #{self.order.order_id}"