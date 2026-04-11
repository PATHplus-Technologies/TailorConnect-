from django.db.models.signals import post_save
from django.dispatch import receiver
from chat.models import Message
from reviews.models import Review
from orders.models import Order
from .models import Notification

@receiver(post_save, sender=Message)
def create_message_notification(sender, instance, created, **kwargs):
    if created:
        # Avoid notifying oneself if needed, but usually sender != recipient
        # Multiple participants in conversation, notify others
        participants = instance.conversation.participants.exclude(id=instance.sender.id)
        for user in participants:
            Notification.objects.create(
                recipient=user,
                actor=instance.sender,
                verb='sent you a message',
                notification_type='message',
                target_id=str(instance.conversation.id)
            )

@receiver(post_save, sender=Review)
def create_review_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            recipient=instance.tailor.user,
            actor=instance.client,
            verb='left you a review',
            notification_type='review',
            target_id=str(instance.id)
        )

@receiver(post_save, sender=Order)
def create_order_notification(sender, instance, created, **kwargs):
    if not created:
        # Check if status has changed to 'completed'
        # Note: A more robust way is to check previous state, 
        # but for simplicity we'll trigger if it's currently completed.
        if instance.status == 'completed':
            Notification.objects.create(
                recipient=instance.client,
                actor=instance.tailor.user,
                verb='completed your order',
                notification_type='order',
                target_id=str(instance.order_id)
            )
