from rest_framework import viewsets, permissions
from rest_framework import viewsets, permissions
from django.db import models
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users see transactions for ANY order they are involved in (client or tailor)
        user = self.request.user
        return Transaction.objects.filter(
            models.Q(order__client=user) | models.Q(order__tailor__user=user)
        )
