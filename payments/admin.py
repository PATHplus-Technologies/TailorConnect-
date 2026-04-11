from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'amount', 'status', 'timestamp')
    list_filter = ('status', 'timestamp')
    search_fields = ('provider_ref', 'order__order_id')
