from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from .models import TailorProfile
from .serializers import UserSerializer, TailorProfileSerializer, ClientDetailSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve' and self.request.user.role == 'tailor':
            return ClientDetailSerializer
        return UserSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # If a tailor is trying to view someone who is NOT a client, block them
        if request.user.role == 'tailor' and instance.role != 'client':
            return Response({"detail": "Tailors can only view client details."}, status=403)
        return super().retrieve(request, *args, **kwargs)

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticatedOrReadOnly()]


from .permissions import IsOwnerOrReadOnly

from django.db.models import Case, When, Value, IntegerField

class TailorProfileViewSet(viewsets.ModelViewSet):
    queryset = TailorProfile.objects.filter(user__role='tailor')
    serializer_class = TailorProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['user__username', 'bio', 'location', 'specialties__name']
    filterset_fields = {
        'specialties__name': ['exact', 'icontains'],
        'location': ['exact', 'icontains'],
    }

    def get_queryset(self):
        queryset = TailorProfile.objects.filter(user__role='tailor')
        user = self.request.user

        if user.is_authenticated and user.address:
            # Simple heuristic: Split address by comma to find city/zone
            # e.g. "Dixinn, Conakry" -> match "Dixinn" or "Conakry"
            address_parts = [part.strip() for part in user.address.split(',') if part.strip()]
            
            if address_parts:
                # Create a case for each part of the address
                # Prioritize exact matches or partial matches
                # For simplicity, we'll just check if the tailor's location contains the first part of the user's address
                # which is usually the most specific (e.g. Zone/Neighborhood)
                primary_zone = address_parts[0]
                
                queryset = queryset.annotate(
                    is_local=Case(
                        When(location__icontains=primary_zone, then=Value(1)),
                        default=Value(0),
                        output_field=IntegerField(),
                    )
                ).order_by('-is_local', '-id') # Show local first, then by ID (newest?) or random
                return queryset
        
        return queryset.order_by('-id')

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_clients(self, request):
        from orders.models import Order
        from chat.models import Conversation
        
        user = request.user
        if user.role != 'tailor':
            return Response({"detail": "Only tailors can access this."}, status=status.HTTP_403_FORBIDDEN)
            
        # Clients from orders
        ordered_client_ids = Order.objects.filter(tailor__user=user).values_list('client', flat=True)
        
        # Clients from chats
        chat_client_ids = User.objects.filter(
            conversations__participants=user,
            role='client'
        ).values_list('id', flat=True)
        
        all_client_ids = set(list(ordered_client_ids) + list(chat_client_ids))
        clients = User.objects.filter(id__in=all_client_ids)
        
        serializer = UserSerializer(clients, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def specialties(self, request):
        from .models import Specialty
        from django.db.models import Count
        # Get specialties that have at least one tailor
        specs = Specialty.objects.annotate(
            tailor_count=Count('tailors')
        ).filter(tailor_count__gt=0).order_by('-tailor_count')
        
        return Response([{"name": s.name, "count": s.tailor_count} for s in specs])

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
