from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import TailorProfile, Specialty

User = get_user_model()

@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)

@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('username', 'email')

@admin.register(TailorProfile)
class TailorProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "experience", "location", "available")
    search_fields = ("user__username", "location")
    filter_horizontal = ("specialties",)

    def get_queryset(self, request):
        return super().get_queryset(request).filter(user__role='tailor')