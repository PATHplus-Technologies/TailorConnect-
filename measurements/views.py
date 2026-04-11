from rest_framework import viewsets, permissions
from .models import MeasurementProfile
from .serializers import MeasurementProfileSerializer

class MeasurementProfileViewSet(viewsets.ModelViewSet):
    serializer_class = MeasurementProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users can only see their own measurements
        return MeasurementProfile.objects.filter(user=self.request.user)
