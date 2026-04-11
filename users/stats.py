from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from users.models import TailorProfile
from designs.models import Design
from orders.models import Order

User = get_user_model()

@api_view(['GET'])
@permission_classes([AllowAny])
def platform_stats(request):
    """
    Returns platform statistics for the home page
    """
    stats = {
        'total_clients': User.objects.filter(role='client').count(),
        'total_tailors': TailorProfile.objects.filter(user__role='tailor').count(),
        'total_designs': Design.objects.count(),
        'completed_orders': Order.objects.filter(status='completed').count(),
    }
    return Response(stats)
