from django.db import models
from django.conf import settings
# We need to import the TailorProfile dynamically or use string reference to avoid circular imports if possible
# But usually models are loaded safe. safer to use settings.AUTH_USER_MODEL for user.
# For TailorProfile, we can use 'users.TailorProfile' string if 'users' app is loaded.

class Review(models.Model):
    client = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews_written')
    tailor = models.ForeignKey('users.TailorProfile', on_delete=models.CASCADE, related_name='reviews_received')
    # Optional: Link to an order to ensure verified purchase
    order = models.ForeignKey('orders.Order', on_delete=models.SET_NULL, null=True, blank=True, related_name='review')
    
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=5)
    comment = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('client', 'order') # Prevent multiple reviews for same order

    def __str__(self):
        return f"Review {self.rating}* by {self.client.username} for {self.tailor.user.username}"
