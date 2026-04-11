from django.contrib import admin
from .models import MeasurementProfile

@admin.register(MeasurementProfile)
class MeasurementProfileAdmin(admin.ModelAdmin):
    list_display = ('profile_name', 'user', 'updated_at')
    search_fields = ('profile_name', 'user__username')
    list_filter = ('updated_at',)
