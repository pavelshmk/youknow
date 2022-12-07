from django.contrib import admin
from nested_admin.nested import NestedTabularInline

from .models import AppUser, BalanceEvent, WithdrawRequest


class BalanceEventInline(NestedTabularInline):
    model = BalanceEvent
    readonly_fields = 'user', 'type', 'amount', 'time', 'quiz',
    extra = 0
    max_num = 0


@admin.register(AppUser)
class AppUserAdmin(admin.ModelAdmin):
    list_display = 'id', 'name', 'balance', 'phone_number', 'telegram_id'
    search_fields = 'id', 'name', 'balance', 'phone_number',
    inlines = BalanceEventInline,


@admin.register(WithdrawRequest)
class WithdrawRequestAdmin(admin.ModelAdmin):
    list_display = 'user', 'amount', 'processed',
