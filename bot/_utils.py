import math

import humanize
from django.utils import timezone
from telegram import Update, ReplyKeyboardMarkup as RKM, InlineKeyboardMarkup as IKM, InlineKeyboardButton as IKB
from telegram.ext import CommandHandler as _CommandHandler, CallbackQueryHandler as _CallbackQueryHandler, \
    MessageHandler as _MessageHandler, ConversationHandler as _ConversationHandler, \
    PollAnswerHandler as _PollAnswerHandler, CallbackContext

from quiz.models import QuizCategory, Quiz
from users.models import AppUser


def get_app_user(update: Update, ctx: CallbackContext):
    user = update.effective_user
    try:
        return AppUser.objects.get(telegram_id=user.id)
    except AppUser.DoesNotExist:
        return None


class HandlerMixin:
    def collect_additional_context(self, context, update, dispatcher, check_result):
        context.user = get_app_user(update, context)


class CommandHandler(HandlerMixin, _CommandHandler):
    pass


class CallbackQueryHandler(HandlerMixin, _CallbackQueryHandler):
    pass


class MessageHandler(HandlerMixin, _MessageHandler):
    pass


class ConversationHandler(HandlerMixin, _ConversationHandler):
    pass


class PollAnswerHandler(HandlerMixin, _PollAnswerHandler):
    pass


class State:
    MAIN = 'main'

    AUTH = 'auth'
    AUTH_PHONENUM = 'auth_phonenum'
    AUTH_PHONECODE = 'auth_phonecode'
    AUTH_EMAILADDR = 'auth_emailaddr'
    AUTH_EMAILPASS = 'auth_emailpass'
    AUTH_EMAILCODE = 'auth_emailcode'

    CQUIZ_TITLE = 'cquiz_title'
    CQUIZ_DESCRIPTION = 'cquiz_description'
    CQUIZ_PRICE = 'cquiz_price'
    CQUIZ_MINPLAYERS = 'cquiz_minplayers'
    CQUIZ_MAXLENGTH = 'cquiz_maxlength'
    CQUIZ_STARTTIME = 'cquiz_starttime'
    CQUIZ_QUESTIONS = 'cquiz_questions'

    DEPOSIT_SUM = 'deposit_sum'
    WITHDRAW_SUM = 'withdraw_sum'
    WITHDRAW_DESTINATION = 'withdraw_destination'

    CABINET_USERNAME = 'cabinet_username'


class Buttons:
    CURRENT_QUIZZES = 'Викторины'
    CREATE_QUIZ = 'Запустить викторину'
    BALANCE = 'Баланс'
    ACHIEVEMENTS = 'Достижения'
    CABINET = 'Личный кабинет'
    DEPOSIT = 'Пополнение счета'
    WITHDRAW = 'Вывод средств'
    REFERRAL = 'Реферальная программа'
    FAQ = 'FAQ'
    MENU = 'Главное меню'

    CQUIZ_FINISH = 'Завершить добавление опросов'
    CANCEL = 'Отмена'


def main_menu(update: Update, ctx: CallbackContext):
    update.effective_message.reply_text('Главное меню', reply_markup=RKM([
        [Buttons.CURRENT_QUIZZES, Buttons.CREATE_QUIZ],
        [Buttons.BALANCE, Buttons.CABINET],
    ], resize_keyboard=True))
    if 'referral' in ctx.user_data and 'shown' not in ctx.user_data['referral']:
        try:
            quiz = Quiz.objects.get(pk=ctx.user_data['referral']['qid'])
            info, markup = render_quiz(quiz, ctx)
            update.effective_message.reply_text(info, reply_markup=markup)
            ctx.user_data['referral']['shown'] = True
        except Quiz.DoesNotExist:
            del ctx.user_data['referral']
    return State.MAIN


def render_quiz(quiz: Quiz, ctx: CallbackContext):
    humanize.activate('ru')
    add_message = ''
    if quiz.participations.count() >= quiz.start_players:
        if not quiz.started:
            add_message = '(начнется через {})'.format(humanize.naturaldelta(quiz.start_datetime - timezone.now()))
        elif not quiz.finished:
            add_message = '(закончится через {})'.format(humanize.naturaldelta(quiz.end_time - timezone.now()))
        else:
            add_message = '(закончена)'
    info = 'Викторина "{}"\n\n' \
           '{}\n\n' \
           'Автор: {}\n' \
           'Категория: "{}"\n' \
           'Стоимость участия: {:.2f} руб.\n' \
           'Участников: {}/{} {}\n' \
           'Банк: {:.2f} руб.\n\n' \
           'Реферальная ссылка: https://t.me/{}?start=q{}_{}'.format(
               quiz.title,
               quiz.description,
               quiz.creator,
               quiz.category.title,
               quiz.entry_price,
               quiz.participations.count(),
               quiz.start_players,
               add_message,
               quiz.bank,
               ctx.bot.username,
               quiz.pk,
               ctx.user.pk
           )
    buttons = []

    block_reason = quiz.block_reason_message(ctx.user)
    if block_reason:
        buttons.append([IKB(block_reason, callback_data='dummy')])
    else:
        buttons.append([IKB('Участвовать', callback_data='quiz_enter {}'.format(quiz.pk))])

    if quiz.owner == ctx.user and not quiz.started and quiz.participations.count() >= 2:
        buttons.append([IKB('Начать викторину', callback_data='quiz_start {}'.format(quiz.pk))])

    if quiz.owner == ctx.user and quiz.creator == ctx.user and not quiz.deleted:
        buttons.append([IKB('Удалить', callback_data='quiz_delete {}'.format(quiz.pk))])

    buttons.extend([
        [IKB('< К категории', callback_data='quiz_cat {}'.format(quiz.category_id))],
        [IKB('<< К категориям', callback_data='quiz_catlist')],
    ])
    return info, IKM(buttons)


def pagination_row(page: int, count: int, prefix: str):
    pages = math.ceil(count / 10) - 1
    buttons = []

    if page == 0:
        buttons.append(IKB(' ', callback_data='dummy'))
    else:
        buttons.append(IKB('<', callback_data='{} {}'.format(prefix, page-1)))

    if count:
        page_label = '[{}-{} из {}]'.format(page*10+1, min([(page+1)*10+1, count]), count)
    else:
        page_label = '[Нет элементов]'
    buttons.append(IKB(page_label, callback_data='dummy'))

    if page >= pages:
        buttons.append(IKB(' ', callback_data='dummy'))
    else:
        buttons.append(IKB('>', callback_data='{} {}'.format(prefix, page+1)))

    return buttons
