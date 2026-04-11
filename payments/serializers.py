from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['status', 'timestamp']

    # In a real app, you wouldn't let users simple 'create' a successful transaction via API.
    # It would be a webhook or a specific flow. For MVP, we allow creating 'pending' transactions.
