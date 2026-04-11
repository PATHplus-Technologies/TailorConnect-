from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'tailor':
            return Order.objects.filter(tailor__user=user).select_related('client', 'tailor', 'design').order_by('-created_at')
        return Order.objects.filter(client=user).select_related('client', 'tailor', 'design').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)
