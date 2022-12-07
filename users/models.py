import logging
from datetime import timedelta
from decimal import Decimal
from uuid import uuid4

from django.contrib.auth.hashers import make_password, check_password
from django.db import models
from django.utils.timezone import now
from dynamic_preferences.registries import global_preferences_registry
from phonenumber_field.modelfields import PhoneNumberField
from yandex_checkout import Configuration, Payment


global_preferences = global_preferences_registry.manager()


DEFAULT_AVATAR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAAAAABVicqIAAACs0lEQVR4Ae3YWU/bQBSG4W88TrOBS' \
                 'RMaqQVStfT//yFoqhYKCaROQrwvM5WQQCgsPnPG+CrvRXIz0uNjeyzZQuP92yE75LEdskN2yA4Bik0UZ4WCdNu9ft95B0Qt/eDp' \
                 'Wnkw2hP1Iup2XmC73mdP1IisL1O8lHfSrgtRlwu8kjMZ1oPk0xCvNz4SNSDZWYq3Gn6tVBxUVJy/bcD/o20RPU1Q0b+5LXIdoLK' \
                 'rwA4JZyD0W9kg+gKU0rkNsopAap7zET0DLbXgI1EMYgvNRnxQyzdcRK9Bbs1FsoyOsCcJQS8pmUgCE4WJZCZIzkRKE6RgItoE0U' \
                 'xEmCCCiUgTRDKRlgnSYiJtE6TNRHomg3An6Uo6sg8mIjw64nERDMmGc8BGvA9UZCjZiBhTkTHYCA6JW2XUsUCcY5Ihv8ACwWBAQ' \
                 'Y5bVoiYEK79cAgrBO6prDL6E2GJoFul9E6dGt60wmn+1vPkm4saEGS/QrzWpyMHtSBQ89nLy1ongxrf45OrFZ4lx2MJIkIrXiwL' \
                 'PK0zGrn1f1tR4V2YlBqA43b3vI54r69EuiyVcKRDBOiIVmned1+erfXBqQPJ/XWkIA+H26enDFerAu7+R8+xRNKZ/7Cg4/V7LSH' \
                 'uRyuSKAjVw308PpQEhLw/HFcK6KJUW9vleCDoyPOdTmwwcXlI9DMHufb3LgeJzkoYJH/0zR/16bmRgfI8MkbUtAAMlcwU+RvDtG' \
                 'KqzJDgFuZFV0aIvgCnm8AE8WOwutB0RM/AK/bpyCoFs2tNRm7BLVtSkSQAuxtNRJbgF8U0RNsg8GlIltggK01CNrApixtAcEdBd' \
                 'GiHbChIkdkhoSYgEexSCQFJYFnUBEKZJG0CyWyRtBrRuS2S6Uqk1LaIUpVIAevyJpCyElFNIGUTiLZHVBOnS2MrF/aJ+5/H/+cH' \
                 '/h8Plh6yEC/PsQAAAABJRU5ErkJggg=='


class BalanceEventType:
    DEPOSIT = 'deposit'
    WITHDRAW = 'withdraw'
    FIRST_PLACE = '1stplace'
    SECOND_PLACE = '2ndplace'
    THIRD_PLACE = '3rdplace'
    REFERRAL = 'referral'
    CREATOR = 'creator'

    choices = (
        (DEPOSIT, 'Deposit'),
        (WITHDRAW, 'Withdraw'),
        (FIRST_PLACE, '1st place'),
        (SECOND_PLACE, '2nd place'),
        (THIRD_PLACE, '3rd place'),
        (REFERRAL, 'Referral'),
        (CREATOR, 'Creator'),
    )

    @classmethod
    def get_for_place(cls, place):
        return [cls.FIRST_PLACE, cls.SECOND_PLACE, cls.THIRD_PLACE][place]


class AppUser(models.Model):
    username = models.CharField(max_length=64, null=True, blank=True)
    email = models.EmailField(null=True, blank=True, db_index=True)
    password = models.CharField(max_length=128, null=True, blank=True)
    phone_number = PhoneNumberField(null=True, blank=True, db_index=True)
    telegram_id = models.BigIntegerField(null=True, blank=True, db_index=True)
    balance = models.DecimalField(default=0, max_digits=32, decimal_places=2)
    avatar = models.TextField(default=DEFAULT_AVATAR)

    is_authenticated = True

    @property
    def name(self):
        return self.username or 'user_{}'.format(self.pk)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    @property
    def achievements(self) -> 'Achievement':
        if not self._achievements:
            return Achievements.objects.create(user=self)
        return self._achievements

    @property
    def wins(self):
        return self.participations.filter(place__lt=3).count()

    def __str__(self):
        return self.name


class AppUserToken(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='tokens')
    uuid = models.UUIDField(default=uuid4)
    push_token = models.CharField(max_length=64, null=True, blank=True)


class Achievements(models.Model):
    user = models.OneToOneField(AppUser, on_delete=models.CASCADE, related_name='_achievements')


class WithdrawRequest(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='withdraw_requests')
    amount = models.DecimalField(default=0, max_digits=32, decimal_places=2)
    destination = models.TextField()
    processed = models.BooleanField(default=False, help_text='Info for admin only')


class BalanceEvent(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='balance_events')
    type = models.CharField(max_length=8, choices=BalanceEventType.choices)
    amount = models.DecimalField(max_digits=32, decimal_places=2)
    time = models.DateTimeField(auto_now_add=True)
    quiz = models.ForeignKey('quiz.Quiz', on_delete=models.SET_NULL, null=True, blank=True, related_name='events')


class Deposit(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='deposits')
    yk_id = models.CharField(max_length=36, db_index=True)
    amount = models.DecimalField(max_digits=32, decimal_places=2)
    finished = models.BooleanField(default=False)
    expire = models.DateTimeField(null=True, blank=True)
    is_bot = models.BooleanField(default=False)

    @staticmethod
    def create(user: AppUser, amount: Decimal, is_bot=False):
        Configuration.configure(global_preferences['api__yandex_kassa_shopid'],
                                global_preferences['api__yandex_kassa_secretkey'])
        payment = Payment.create({
            'amount': {
                'value': '{:.2f}'.format(amount),
                'currency': 'RUB',
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': 'https://google.com/',
            },
            'capture': True,
            'description': 'Пополнение баланса YouKnow',
        }, uuid4())
        deposit = Deposit.objects.create(user=user, yk_id=payment.id, amount=amount,
                                         expire=now() + timedelta(minutes=30), is_bot=True)
        return deposit, payment.confirmation.confirmation_url

    def check_status(self):
        from bot.__main__ import get_bot

        if self.finished:
            return
        Configuration.configure(global_preferences['api__yandex_kassa_shopid'],
                                global_preferences['api__yandex_kassa_secretkey'])
        payment = Payment.find_one(self.yk_id)
        if self.expire and now() > self.expire and payment.status != 'succeeded':
            Payment.cancel(self.yk_id, uuid4())
            self.finished = True
            self.save()
            return
        if payment.status == 'waiting_for_capture':
            Payment.capture(self.yk_id)
            self.expire = None
            self.save()
            return
        if payment.status == 'succeeded':
            self.user.balance += self.amount
            self.user.save(update_fields=('balance',))
            self.finished = True
            self.save()
            BalanceEvent.objects.create(user=self.user, type=BalanceEventType.DEPOSIT, amount=self.amount)
            if self.is_bot:
                get_bot().send_message(self.user.telegram_id,
                                       'Баланс был успешно пополнен на {:.2f} руб.'.format(self.amount))
