from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Filter by tailor if provided in query params
        tailor_id = self.request.query_params.get('tailor_id')
        if tailor_id:
            return Review.objects.filter(tailor__id=tailor_id)
        return Review.objects.all()
