from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    design_title = serializers.ReadOnlyField(source='design.name')
    design_image = serializers.ImageField(source='design.image', read_only=True)
    tailor_name = serializers.ReadOnlyField(source='tailor.user.username')
    tailor_user_id = serializers.ReadOnlyField(source='tailor.user.id')
    measurement_snapshot = serializers.SerializerMethodField()
    is_reviewed = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['order_id', 'client', 'tailor', 'design', 'design_title', 'design_image', 'tailor_name', 'tailor_user_id',
                  'measurements', 'measurement_snapshot', 'image_reference', 'price', 'status', 'created_at', 'is_reviewed']
        read_only_fields = ['order_id', 'created_at']
    
    def get_is_reviewed(self, obj):
        # Check if a review exists for this order
        return obj.review.exists()
    def get_measurement_snapshot(self, obj):
        if obj.measurements:
            from measurements.serializers import MeasurementProfileSerializer
            return MeasurementProfileSerializer(obj.measurements).data
        return None