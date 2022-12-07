from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from phonenumber_field.phonenumber import PhoneNumber
from telegram import Update, InlineKeyboardMarkup as IKM, InlineKeyboardButton as IKB, ReplyKeyboardMarkup as RKM, \
    KeyboardButton as KB, ReplyKeyboardRemove as RKR
from telegram.ext import CallbackContext

from users.models import AppUser
from youknow.utils import send_phone_code, check_phone_code, send_email_code, check_email_code
from .._utils import State, main_menu


def main_handler(update: Update, ctx: CallbackContext):
    if 'signup' in ctx.user_data:
        del ctx.user_data['signup']
    update.effective_message.reply_text('Выберите способ авторизации', reply_markup=IKM([
        [IKB('Телефон', callback_data='auth_phone'), IKB('E-mail', callback_data='auth_email')],
    ]))
    return State.AUTH


def phone_handler(update: Update, ctx: CallbackContext):
    update.effective_message.edit_reply_markup()
    update.effective_message.reply_text('Отправьте номер телефона или /cancel для выбора способа авторизации',
                                        reply_markup=RKM([[KB('Отправить контакт', request_contact=True)]], True))
    return State.AUTH_PHONENUM


def phone_number_handler(update: Update, ctx: CallbackContext):
    if update.effective_message.contact:
        number = update.effective_message.contact.phone_number
    else:
        number = update.effective_message.text
    if number.startswith('8'):
        number = '+7' + number[1:]
    if not number.startswith('+'):
        number = '+' + number
    try:
        number = PhoneNumber.from_string(number)
    except ValidationError:
        update.effective_message.reply_text('Передан неверный номер телефона. '
                                            'Попробуйте еще раз или /cancel для выбора способа авторизации.')
        return
    ctx.user_data['phone_number'] = number.as_e164
    code = send_phone_code(ctx.user_data['phone_number'])
    update.effective_message.reply_text('Код подтверждения был отправлен. Срок действия: 5 минут. '
                                        'Отправьте его или /cancel для выбора способа авторизации.',
                                        reply_markup=RKR())
    return State.AUTH_PHONECODE


def phone_code_handler(update: Update, ctx: CallbackContext):
    number = ctx.user_data['phone_number']
    if not check_phone_code(number, update.effective_message.text):
        update.effective_message.reply_text('Отправлен неверный или истекший код подтверждения. '
                                            'Попробуйте еще раз или /cancel для выбора способа авторизации.')
        return
    ctx.user, created = AppUser.objects.update_or_create(phone_number=number,
                                                         defaults={'telegram_id': update.effective_user.id,
                                                                   'username': update.effective_user.first_name[:64]})
    if created:
        ctx.user.username = update.effective_user.full_name
        ctx.user.save()
    return main_menu(update, ctx)


def email_handler(update: Update, ctx: CallbackContext):
    update.effective_message.edit_reply_markup()
    update.effective_message.reply_text('Отправьте адрес e-mail или /cancel для выбора способа авторизации',
                                        reply_markup=RKR())
    return State.AUTH_EMAILADDR


def email_address_handler(update: Update, ctx: CallbackContext):
    email = BaseUserManager.normalize_email(update.effective_message.text)
    if not email:
        update.effective_message.reply_text('Отправлен некорректный адрес электронной почты. '
                                            'Попробуйте еще раз или /cancel для выбора способа авторизации.')
        return
    try:
        user = AppUser.objects.get(email=email.lower())
        ctx.user_data['user_pk'] = user.pk
        update.effective_message.reply_text('Отправьте пароль или /cancel для выбора способа авторизации')
    except AppUser.DoesNotExist:
        update.effective_message.reply_text('Этот адрес e-mail не зарегистрирован. '
                                            'Отправьте пароль для регистрации или '
                                            '/cancel для выбора способа авторизации.')
        ctx.user_data['email'] = email.lower()
        ctx.user_data['signup'] = True
    return State.AUTH_EMAILPASS


def email_password_handler(update: Update, ctx: CallbackContext):
    if ctx.user_data.get('signup'):
        ctx.user_data['password'] = update.effective_message.text
        code = send_email_code(ctx.user_data['email'])
        update.effective_message.reply_text('Код подтверждения был выслан. '
                                            'Отправьте его или /cancel для выбора способа авторизации.')
        return State.AUTH_EMAILCODE
    else:
        ctx.user = AppUser.objects.get(pk=ctx.user_data['user_pk'])
        if not ctx.user.check_password(update.effective_message.text):
            update.effective_message.reply_text('Отправлен неверный пароль. '
                                                'Попробуйте еще раз или /cancel для выбора способа авторизации.')
            return
        ctx.user.telegram_id = update.effective_user.id
        ctx.user.save()
        return main_menu(update, ctx)


def email_code_handler(update: Update, ctx: CallbackContext):
    if not check_email_code(ctx.user_data['email'], update.effective_message.text):
        update.effective_message.reply_text('Отправлен неверный или истекший код подтверждения. '
                                            '/cancel для выбора способа авторизации или '
                                            'если вы допустили ошибку при вводе e-mail или пароля.')
        return
    user = AppUser(email=ctx.user_data['email'], telegram_id=update.effective_user.id,
                   username=update.effective_user.first_name[:64])
    user.set_password(ctx.user_data['password'])
    user.save()
    del ctx.user_data['email']
    del ctx.user_data['password']
    del ctx.user_data['signup']
    ctx.user = user
    return main_menu(update, ctx)
