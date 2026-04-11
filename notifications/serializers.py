from rest_framework import serializers
from .models import Notification
from users.serializers import UserSerializer

class NotificationSerializer(serializers.ModelSerializer):
    actor_avatar = serializers.ImageField(source='actor.profile_image', read_only=True)
    actor_username = serializers.CharField(source='actor.username', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'actor_username', 'actor_avatar', 'verb', 'notification_type', 'target_id', 'is_read', 'created_at']
