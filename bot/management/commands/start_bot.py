import logging

from django.core.management import BaseCommand

from bot.__main__ import get_updater


class Command(BaseCommand):
    def handle(self, *args, **options):
        logging.basicConfig(level=logging.WARN)
        updater = get_updater()
        updater.start_polling()
