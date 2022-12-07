import nested_admin.nested
from django.contrib import admin
from django.db import models
from django.forms import TextInput

from users.admin import BalanceEventInline
from .models import QuizCategory, Quiz, QuizQuestion, QuizOption, Foundation


@admin.register(QuizCategory)
class QuizCategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Foundation)
class FoundationAdmin(admin.ModelAdmin):
    pass


class QuizOptionInline(nested_admin.nested.NestedTabularInline):
    model = QuizOption
    extra = 0
    formfield_overrides = {
        models.TextField: {'widget': TextInput}
    }


class QuizQuestionInline(nested_admin.nested.NestedStackedInline):
    model = QuizQuestion
    extra = 0
    inlines = QuizOptionInline,
    formfield_overrides = {
        models.TextField: {'widget': TextInput}
    }



@admin.register(Quiz)
class QuizAdmin(nested_admin.nested.NestedModelAdmin):
    list_display = 'title', 'category', 'owner', 'creator', 'started', 'finished', 'copy_source',
    inlines = QuizQuestionInline, BalanceEventInline,
