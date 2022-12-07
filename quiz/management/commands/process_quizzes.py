from datetime import timedelta
from time import sleep

import humanize
from django.core.management import BaseCommand
from django.db.models import Count, F
from django.utils import timezone
from dynamic_preferences.registries import global_preferences_registry

from bot.__main__ import get_bot
from quiz.models import Quiz


global_preferences = global_preferences_registry.manager()


class Command(BaseCommand):
    def handle(self, *args, **options):
        while True:
            bot = get_bot()
            humanize.activate('ru')
            notification_delta = timedelta(minutes=global_preferences['general__notification_delta'])
            delta_text = humanize.naturaldelta(notification_delta)

            qs = Quiz.objects.annotate(parts=Count('participations'))\
                .filter(parts__gte=F('start_players'), start_datetime__isnull=True)
            for quiz in qs:
                quiz.start_datetime = timezone.now() + timedelta(minutes=quiz.delay_minutes)
                quiz.save()

            qs = Quiz.objects.annotate(parts=Count('participations'))\
                .filter(start_datetime__isnull=False, start_datetime__lte=timezone.now(), started__isnull=True)
            for quiz in qs:  # type: Quiz
                quiz.start(bot)

            qs = Quiz.objects.filter(finished__isnull=True, end_time__lte=timezone.now())
            for quiz in qs:
                quiz.try_finish(bot, force=True)

            qs = Quiz.objects.filter(started__isnull=True, start_datetime__lte=timezone.now() + notification_delta,
                                     notified=False)
            for quiz in qs:
                if quiz.participations.count() >= quiz.start_players:
                    quiz.notify(bot, 'Викторина "{}" начнется через {}'.format(quiz.title, delta_text))
                else:
                    quiz.notify(bot, 'Викторина "{}" должна начнется через {}, '
                                     'но минимальное количество участников еще не набрано.\n'
                                     'Викторина начнется когда будет набрано необходимое '
                                     'количество участников.'.format(quiz.title, delta_text))
                quiz.notified = True
                quiz.save()

            sleep(1)
