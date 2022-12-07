from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework.exceptions import ValidationError
from rest_framework.fields import DecimalField
from rest_framework.serializers import Serializer, CharField, EmailField, ModelSerializer

from users.models import AppUser, BalanceEvent, WithdrawRequest
from youknow.utils import check_phone_code, check_email_code
from quiz.serializers import QuizSerializer


class PhoneNumberSerializer(Serializer):
    phone_number = PhoneNumberField()


class PhoneAuthSerializer(Serializer):
    phone_number = PhoneNumberField()
    code = CharField()
    push_token = CharField()

    def validate(self, attrs):
        if not check_phone_code(attrs['phone_number'].as_e164, attrs['code']):
            raise ValidationError('Неверный код подтверждения')
        return attrs


class EmailAuthSerializer(Serializer):
    email = EmailField()
    password = CharField()
    push_token = CharField()


class EmailConfirmSerializer(Serializer):
    email = EmailField()
    password = CharField()
    code = CharField()
    push_token = CharField()

    def validate(self, attrs):
        if not check_email_code(attrs['email'], attrs['code']):
            raise ValidationError('Неверный код подтверждения')
        return attrs


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = AppUser
        fields = 'pk', 'username', 'name', 'email', 'phone_number', 'balance', 'wins', 'avatar',


class BalanceEventSerializer(ModelSerializer):
    quiz = QuizSerializer()

    class Meta:
        model = BalanceEvent
        fields = 'pk', 'type', 'amount', 'quiz', 'time',


class DepositSerializer(Serializer):
    amount = DecimalField(max_digits=32, decimal_places=2)
    option = CharField()


class WithdrawSerializer(ModelSerializer):
    # option = CharField()

    class Meta:
        model = WithdrawRequest
        fields = 'amount', 'destination',


class UpdateProfileSerializer(ModelSerializer):
    class Meta:
        model = AppUser
        fields = 'username', 'avatar',
