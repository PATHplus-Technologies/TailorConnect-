from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    client_username = serializers.ReadOnlyField(source='client.username')
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['client', 'created_at']

    def validate(self, data):
        order = data.get('order')
        tailor = data.get('tailor')
        user = self.context['request'].user
        
        if order:
            if order.client != user:
                raise serializers.ValidationError("You can only review your own orders.")
            if tailor and order.tailor != tailor:
                raise serializers.ValidationError("Tailor mismatch for this order.")
        
        return data

    def create(self, validated_data):
        validated_data['client'] = self.context['request'].user
        return super().create(validated_data)
