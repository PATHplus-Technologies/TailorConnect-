from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView

from users.views import UserViewSet, TailorProfileViewSet, CustomTokenObtainPairView
from users.stats import platform_stats
from designs.views import DesignViewSet
from orders.views import OrderViewSet
from measurements.views import MeasurementProfileViewSet
from reviews.views import ReviewViewSet
from chat.views import ConversationViewSet, MessageViewSet
from payments.views import TransactionViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', TailorProfileViewSet)
router.register(r'designs', DesignViewSet, basename='design')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'measurements', MeasurementProfileViewSet, basename='measurement')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path("api/token/", CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("api/token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
    path("api/stats/", platform_stats, name='platform_stats'),
    path("admin/", admin.site.urls),
    path("api/notifications/", include('notifications.urls')),
    path("api/password_reset/", include('django_rest_passwordreset.urls', namespace='password_reset')),
    path("api/", include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
