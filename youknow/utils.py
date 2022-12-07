import decimal
import logging
from random import randint
from uuid import uuid4

from datauri import DataURI
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.core.mail import EmailMessage
from django.db.models.fields.files import FieldFile
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.fields import ImageField
from rest_framework.request import Request
from telegram import Update

from users.models import AppUserToken
from youknow.mainsms import SMS


def _get_phone_code_key(number):
    return 'phonecode.{}'.format(number)


def _get_email_code_key(email):
    return 'emailcode.{}'.format(email)


def send_phone_code(number):
    code = '{:06d}'.format(randint(0, 999999))
    cache.set(_get_phone_code_key(number), code, timeout=5*60)
    logging.warning('Phone code: {}'.format(code))
    SMS('youknow', '2edb24e6d0e77').sendSMS(number, 'Код подтверждения: {}\n'
                                                    'Время действия: 5 минут'.format(code))
    return code


def check_phone_code(number, code):
    try:
        return int(cache.get(_get_phone_code_key(number))) == int(code)
    except:
        return False


def send_email_code(email):
    code = '{:06d}'.format(randint(0, 999999))
    cache.set(_get_email_code_key(email), code, timeout=5*60)
    logging.warning('Email code: {}'.format(code))
    email = EmailMessage('Код подтверждения YouKnow', 'Ваш код подтверждения: {}\n'
                                                      'Время действия: 5 минут'.format(code), to=[email])
    email.send()
    return code


def check_email_code(email, code):
    try:
        return int(cache.get(_get_email_code_key(email))) == int(code)
    except:
        return False


def read_decimal(update: Update):
    try:
        decctx = decimal.getcontext()
        decctx.prec = 2
        return decimal.Decimal(update.effective_message.text)
    except (ArithmeticError, ValueError, TypeError):
        return None


class AppTokenAuthentication(BaseAuthentication):
    def authenticate(self, request: Request):
        auth = get_authorization_header(request).split(maxsplit=1)
        if not auth or auth[0].lower() != b'token':
            return None
        if len(auth) != 2:
            raise AuthenticationFailed('Token is not provided')

        try:
            token = AppUserToken.objects.get(uuid=auth[1].decode())
            return token.user, token
        except (AppUserToken.DoesNotExist, ValidationError):
            raise AuthenticationFailed('Incorrect token')


class DataURIField(ImageField):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            du = DataURI(data)
            data = ContentFile(du.data, '{}.{}'.format(uuid4(), du.mimetype.split('/')[1]))
        return super().to_internal_value(data)

    def to_representation(self, value: FieldFile):
        if not value:
            return None
        return DataURI.from_file(value.path)
