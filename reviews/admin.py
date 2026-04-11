from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('order', 'client', 'tailor', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('client__username', 'tailor__user__username', 'comment')
