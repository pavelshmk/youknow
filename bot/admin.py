from django.contrib import admin
from dynamic_preferences.admin import GlobalPreferenceAdmin
from dynamic_preferences.models import GlobalPreferenceModel


admin.site.unregister(GlobalPreferenceModel)


@admin.register(GlobalPreferenceModel)
class GlobalPreferenceAdmin(GlobalPreferenceAdmin):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).exclude(section__in=['bot_persistence'])
