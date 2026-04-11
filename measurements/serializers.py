from rest_framework import serializers
from .models import MeasurementProfile

class MeasurementProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasurementProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Ensure the user is attached to the measurement profile
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
