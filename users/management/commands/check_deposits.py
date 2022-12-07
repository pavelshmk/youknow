import traceback
from time import sleep

from django.core.management import BaseCommand

from users.models import Deposit


class Command(BaseCommand):
    def handle(self, *args, **options):
        while True:
            try:
                for deposit in Deposit.objects.filter(finished=False):
                    deposit.check_status()
            except KeyboardInterrupt:
                return
            except:
                traceback.print_exc()
            sleep(10)
