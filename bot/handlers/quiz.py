import json

import humanize
from django.utils import timezone
from dynamic_preferences.registries import global_preferences_registry
from telegram import Update, InlineKeyboardMarkup as IKM, InlineKeyboardButton as IKB
from telegram.ext import CallbackContext

from bot._utils import render_quiz, pagination_row
from quiz.models import QuizCategory, Quiz, QuizParticipation, QuizAnswer
from users.models import AppUser


global_preferences = global_preferences_registry.manager()


def main_handler(update: Update, ctx: CallbackContext):
    buttons = []
    for c in QuizCategory.objects.all():
        buttons.append(IKB('{} ({})'.format(c.title, c.quizzes.filter(started__isnull=True).count()),
                           callback_data='quiz_cat {} 0'.format(c.pk)))
    meth = update.effective_message.edit_text if update.callback_query else update.effective_message.reply_text
    extra = [
        [
            IKB('[Составленные]', callback_data='quiz_mylist creator 0'),
            IKB('[Участвую]', callback_data='quiz_mylist participation 0'),
            IKB('[Запущенные]', callback_data='quiz_mylist owner 0'),
        ],
    ]
    meth('Выберите категорию для поиска викторины',
         reply_markup=IKM(extra + [buttons[i:i + 2] for i in range(0, len(buttons), 2)]))


def category_handler(update: Update, ctx: CallbackContext):
    _, catid, page = update.callback_query.data.split()
    page = int(page)
    cat = QuizCategory.objects.get(pk=catid)
    qs = Quiz.objects.filter(category=cat, started__isnull=True)
    if not qs.count():
        markup = IKM([[IKB('< К категориям', callback_data='quiz_catlist')]])
        update.effective_message.edit_text('Викторин в категории "{}" нет'.format(cat.title), reply_markup=markup)
        return
    buttons = []
    for quiz in qs[page*10:(page+1)*10]:
        buttons.append([IKB(quiz.button_text(), callback_data='quiz_info {}'.format(quiz.pk))])
    buttons.append(pagination_row(page, qs.count(), 'quiz_cat ' + catid))
    buttons.append([IKB('< К категориям', callback_data='quiz_catlist')])
    update.effective_message.edit_text('Викторины в категории "{}"'.format(cat.title), reply_markup=IKM(buttons))


def mylist_handler(update: Update, ctx: CallbackContext):
    _, list_type, page = update.callback_query.data.split()
    page = int(page)
    if list_type == 'creator':
        qs = Quiz.objects.filter(creator=ctx.user, started__isnull=True)
    elif list_type == 'participation':
        qs = Quiz.objects.filter(participations__user=ctx.user, started__isnull=True)
    elif list_type == 'owner':
        qs = Quiz.objects.filter(owner=ctx.user, started__isnull=True)
    if not qs.count():
        markup = IKM([[IKB('< К категориям', callback_data='quiz_catlist')]])
        update.effective_message.edit_text('Нет викторин выбранного типа', reply_markup=markup)
        return
    buttons = []
    for quiz in qs[page*10:(page+1)*10]:
        buttons.append([IKB(quiz.button_text(), callback_data='quiz_info {}'.format(quiz.pk))])
    buttons.append(pagination_row(page, qs.count(), 'quiz_mylist ' + list_type))
    buttons.append([IKB('< К категориям', callback_data='quiz_catlist')])
    update.effective_message.edit_text('Список викторин', reply_markup=IKM(buttons))


def info_handler(update: Update, ctx: CallbackContext):
    _, quizid = update.callback_query.data.split()
    quiz = Quiz.objects.get(pk=quizid)
    info, markup = render_quiz(quiz, ctx)
    update.effective_message.edit_text(info, reply_markup=markup)


def enter_handler(update: Update, ctx: CallbackContext):
    _, quizid = update.callback_query.data.split()
    quiz = Quiz.objects.get(pk=quizid)

    block_reason = quiz.block_reason_message(ctx.user)
    if block_reason:
        update.callback_query.answer(block_reason)
        return

    ctx.user.balance -= quiz.entry_price
    ctx.user.save()
    referrer = None
    if 'referral' in ctx.user_data:
        if str(quiz.pk) == ctx.user_data['referral']['qid']:
            try:
                referrer = AppUser.objects.get(pk=ctx.user_data['referral']['rid'])
            except AppUser.DoesNotExist:
                pass
    QuizParticipation.objects.create(user=ctx.user, quiz=quiz, referrer=referrer)
    quiz.bank += quiz.entry_price * (1 - global_preferences['general__quiz_bank_commission'] -
                                     global_preferences['general__quiz_author_commission'])
    quiz.author_commission += quiz.entry_price * global_preferences['general__quiz_author_commission']
    quiz.save()
    info_handler(update, ctx)


def delete_handler(update: Update, ctx: CallbackContext):
    _, quizid = update.callback_query.data.split()
    quiz = Quiz.objects.get(pk=quizid)

    if quiz.deleted:
        update.callback_query.answer('Эта викторина уже удалена')
        return

    quiz.deleted = True
    quiz.save()
    update.callback_query.answer('Викторина теперь недоступна для копирования')
    info_handler(update, ctx)


def answer_handler(update: Update, ctx: CallbackContext):
    try:
        answer = QuizAnswer.objects.get(tg_poll_id=update.poll_answer.poll_id, option__isnull=True)
    except QuizAnswer.DoesNotExist:
        return
    option_idx = update.poll_answer.option_ids[0]
    answer.option_id = json.loads(answer.option_ids)[option_idx]
    answer.save()
    participation = answer.participation
    if answer.option.is_correct:
        participation.answer_points += 1
        participation.save()
    sent_qid = participation.send_tg_poll(ctx.bot)
    if not sent_qid:
        participation.time_points = int((timezone.now() - participation.quiz.started).total_seconds())
        participation.save()
        humanize.activate('ru')
        until_finish = humanize.naturaldelta(participation.quiz.end_time - timezone.now())
        update.effective_user.send_message('Вы закончили викторину. Ожидаем других участников...\n'
                                           'До окончания {}'.format(until_finish))
        participation.quiz.try_finish(ctx.bot)


def start_handler(update: Update, ctx: CallbackContext):
    _, qid = update.callback_query.data.split()
    try:
        quiz = Quiz.objects.get(pk=qid, started__isnull=True, owner=ctx.user)
    except Quiz.DoesNotExist:
        update.callback_query.answer('Викторина не найдена, уже начата или принадлежит не вам')
        return

    quiz.start(ctx.bot)
    update.callback_query.answer('Викторина начата')
