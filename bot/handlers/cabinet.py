from django.db.models import Count, Sum
from telegram import Update, InlineKeyboardMarkup as IKM, InlineKeyboardButton as IKB, ReplyKeyboardRemove as RKR
from telegram.ext import CallbackContext

from bot._utils import State, main_menu


def main_handler(update: Update, ctx: CallbackContext):
    markup = IKM([
        [IKB('Занятые места', callback_data='cabinet_places')],
        [IKB('Изменить имя', callback_data='cabinet_username')],
    ])
    update.effective_message.reply_text('Баланс: {:.2f} руб.\n'
                                        'Выигранных викторин: {}\n'
                                        'Заработанных баллов: {}\n'
                                        'Рефералов: {}'.format(
                                            ctx.user.balance,
                                            ctx.user.participations.filter(place__isnull=False, place__lt=3).count(),
                                            ctx.user.participations.aggregate(cnt=Sum('answer_points'))['cnt'] or 0,
                                            ctx.user.referral_participations.count(),
                                        ),
                                        reply_markup=markup)


def places_handler(update: Update, ctx: CallbackContext):
    result = ['<b>Последние 10 викторин:</b>', '']
    for p in ctx.user.participations.filter(quiz__started__isnull=False).order_by('-quiz__started'):
        result.append(p.quiz.title)
        result.append('<i>{} место ({:.2f} руб.)</i>'.format((p.place or 0) + 1, p.win or 0))
        result.append('')
    update.effective_message.reply_html('\n'.join(result))


def username_handler(update: Update, ctx: CallbackContext):
    update.effective_message.reply_text('Отправьте новое имя или /cancel', reply_markup=RKR())
    return State.CABINET_USERNAME


def username_text_handler(update: Update, ctx: CallbackContext):
    if len(update.effective_message.text) > 64:
        update.effective_message.reply_text('Имя должно быть короче 64 знаков. Попробуйте еще раз или /cancel')
        return
    ctx.user.username = update.effective_message.text
    ctx.user.save()
    update.effective_message.reply_text('Имя было успешно изменено')
    return main_menu(update, ctx)
