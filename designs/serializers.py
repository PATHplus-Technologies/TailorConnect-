from rest_framework import serializers
from .models import Design

class DesignSerializer(serializers.ModelSerializer):
    tailor_name = serializers.ReadOnlyField(source='owner.username')
    tailor_profile_id = serializers.SerializerMethodField()

    class Meta:
        model = Design
        fields = ('id','name','description', 'image','price','owner','tailor_name','tailor_profile_id','created_at', 'updated_at')
        read_only_fields = ('id','owner','created_at')

    def get_tailor_profile_id(self, obj):
        if hasattr(obj.owner, 'tailor_profile'):
            return obj.owner.tailor_profile.id
        return None
