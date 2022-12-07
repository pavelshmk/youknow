from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.cache import cache
from django.views.generic import TemplateView
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from quiz.models import QuizParticipation
from quiz.serializers import QuizParticipationSerializer
from users.models import AppUser, AppUserToken, BalanceEvent, BalanceEventType
from users.serializers import PhoneNumberSerializer, PhoneAuthSerializer, EmailAuthSerializer, EmailConfirmSerializer, \
    ProfileSerializer, BalanceEventSerializer, DepositSerializer, WithdrawSerializer, UpdateProfileSerializer
from youknow.utils import send_phone_code, send_email_code


class CodesView(LoginRequiredMixin, TemplateView):
    template_name = 'codes.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['phone_codes'] = []
        ctx['email_codes'] = []
        for name, code in cache.get_many(cache.keys('phonecode.*')).items():
            ctx['phone_codes'].append((name[10:], code))
        for name, code in cache.get_many(cache.keys('emailcode.*')).items():
            ctx['email_codes'].append((name[10:], code))
        return ctx


class PhoneAuthView(GenericAPIView):
    serializer_class = PhoneNumberSerializer
    permission_classes = AllowAny,

    def post(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        send_phone_code(serializer.validated_data['phone_number'].as_e164)
        return Response({'status': 'ok'})


class PhoneAuthConfirmView(GenericAPIView):
    serializer_class = PhoneAuthSerializer
    permission_classes = AllowAny,

    def post(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, created = AppUser.objects.get_or_create(phone_number=serializer.validated_data['phone_number'].as_international)
        token = AppUserToken.objects.create(user=user, push_token=serializer.validated_data.get('push_token'))
        return Response({'token': str(token.uuid)})


class EmailSignInView(GenericAPIView):
    serializer_class = EmailAuthSerializer
    permission_classes = AllowAny,

    def post(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = AppUser.objects.get(email=serializer.validated_data['email'].lower())
            if not user.check_password(serializer.validated_data['password']):
                raise AppUser.DoesNotExist()
            token = AppUserToken.objects.create(user=user, push_token=serializer.validated_data.get('push_token'))
            return Response({'token': str(token.uuid)})
        except AppUser.DoesNotExist:
            return Response({'status': 'error', 'message': 'not_authorized'}, status=401)


class EmailSignUpView(GenericAPIView):
    serializer_class = EmailAuthSerializer
    permission_classes = AllowAny,

    def post(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if AppUser.objects.filter(email=serializer.validated_data['email'].lower()).count():
            return Response({'status': 'error', 'message': 'email_taken'}, status=409)
        send_email_code(serializer.validated_data['email'])
        return Response({'status': 'ok'})


class EmailSignUpConfirmView(GenericAPIView):
    serializer_class = EmailConfirmSerializer
    permission_classes = AllowAny,

    def post(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if AppUser.objects.filter(email=serializer.validated_data['email'].lower()).count():
            return Response({'status': 'error', 'message': 'email_taken'}, status=409)
        user = AppUser(email=serializer.validated_data['email'].lower())
        user.set_password(serializer.validated_data['password'])
        user.save()
        token = AppUserToken.objects.create(user=user, push_token=serializer.validated_data.get('push_token'))
        return Response({'token': str(token.uuid)})


class ProfileView(GenericAPIView):
    serializer_class = UpdateProfileSerializer
    permission_classes = IsAuthenticated,

    def get(self, request: Request, *args, **kwargs):
        return Response(ProfileSerializer(instance=request.user).data)

    def patch(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, instance=request.user, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ProfileSerializer(instance=serializer.instance).data)


class ParticipationHistoryView(GenericAPIView):
    serializer_class = QuizParticipationSerializer
    permission_classes = IsAuthenticated,

    def get(self, request: Request, *args, **kwargs):
        qs = QuizParticipation.objects.filter(user=request.user, quiz__finished__isnull=False).order_by('-pk')
        return Response(self.get_serializer(instance=qs, many=True).data)


class BalanceEventsView(GenericAPIView):
    serializer_class = BalanceEventSerializer
    permission_classes = IsAuthenticated,

    def get(self, request: Request, *args, **kwargs):
        qs = BalanceEvent.objects.filter(user=request.user).order_by('-pk')
        return Response(self.get_serializer(instance=qs, many=True).data)


class DepositView(GenericAPIView):
    serializer_class = DepositSerializer
    permission_classes = IsAuthenticated,

    def post(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        request.user.balance += serializer.validated_data['amount']
        request.user.save()
        BalanceEvent.objects.create(user=request.user, type=BalanceEventType.DEPOSIT,
                                    amount=serializer.validated_data['amount'])
        return Response({'status': 'ok'})


class WithdrawView(GenericAPIView):
    serializer_class = WithdrawSerializer
    permission_classes = IsAuthenticated,

    def post(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.validated_data['amount'] > request.user.balance:
            return Response({'status': 'error', 'message': 'insufficient_funds'}, status=412)
        serializer.save(user=request.user)
        request.user.balance -= serializer.validated_data['amount']
        request.user.save()
        BalanceEvent.objects.create(user=request.user, type=BalanceEventType.WITHDRAW,
                                    amount=serializer.validated_data['amount'])
        return Response({'status': 'ok'})
