from datetime import timedelta

from django.utils import timezone
from dynamic_preferences.registries import global_preferences_registry
from telegram import Update, Poll, ReplyKeyboardMarkup as RKM, KeyboardButton as KB, ReplyKeyboardRemove as RKR, \
    InlineKeyboardMarkup as IKM, InlineKeyboardButton as IKB, KeyboardButtonPollType
from telegram.ext import CallbackContext

from bot._utils import State, main_menu, Buttons, render_quiz, pagination_row
from quiz.models import Quiz, QuizQuestion, QuizOption, QuizCategory
from quiz.serializers import CreateQuizSerializer
from youknow.utils import read_decimal


global_preferences = global_preferences_registry.manager()


def main_handler(update: Update, ctx: CallbackContext):
    markup = IKM([
        [IKB('Выбрать готовую', callback_data='cquiz_copy'), IKB('Создать новую', callback_data='cquiz_create')]
    ])
    update.effective_message.reply_text('Выберите действие', reply_markup=markup)


def copy_handler(update: Update, ctx: CallbackContext):
    ctx.user_data['cquiz'] = {}
    buttons = []
    for c in QuizCategory.objects.all():  # type: QuizCategory
        count = c.quizzes.filter(copy_source__isnull=True).count()
        if not count:
            continue
        buttons.append(IKB('{} ({})'.format(c.title, count), callback_data='cquiz_copycat {} 0'.format(c.pk)))
    update.effective_message.edit_text('Выберите категорию или /cancel',
                                       reply_markup=IKM(buttons[i:i + 2] for i in range(0, len(buttons), 2)))


def copy_category_handler(update: Update, ctx: CallbackContext):
    _, cid, page = update.callback_query.data.split()
    page = int(page)
    qs = Quiz.objects.filter(category_id=cid, copy_source__isnull=True).order_by('creator_id')
    buttons = []
    for q in qs[page * 10:(page + 1) * 10]:
        buttons.append([IKB(q.copy_button_text(), callback_data='cquiz_copyquiz {}'.format(q.pk))])
    buttons.append(pagination_row(page, qs.count(), 'cquiz_copycat ' + cid))
    buttons.append([IKB('< К категориям', callback_data='cquiz_copy')])
    update.effective_message.edit_text('Выберите викторину для копирования или /cancel',
                                       reply_markup=IKM(buttons))


def copy_quiz_handler(update: Update, ctx: CallbackContext):
    _, qid = update.callback_query.data.split()
    quiz = Quiz.objects.get(pk=qid)
    ctx.user_data['cquiz']['copy_id'] = quiz.pk

    if ctx.user_data['cquiz'].get('copy_id'):
        source_quiz = Quiz.objects.get(pk=ctx.user_data['cquiz']['copy_id'])
        ctx.user_data['cquiz']['creator'] = source_quiz.creator_id
        ctx.user_data['cquiz']['category'] = source_quiz.category_id
        ctx.user_data['cquiz']['title'] = source_quiz.title
        ctx.user_data['cquiz']['description'] = source_quiz.description
        ctx.user_data['cquiz']['copy'] = True
        ctx.user_data['cquiz']['questions'] = []
        for question in source_quiz.questions.all():  # type: QuizQuestion
            options = []
            answer = -1
            correct_comment = None
            for i, option in enumerate(question.options.all()):  # type: QuizOption
                options.append(option.text)
                if option.is_correct:
                    answer = i
                    correct_comment = option.comment
            ctx.user_data['cquiz']['questions'].append({
                'text': question.text,
                'options': options,
                'answer': answer,
                'correct_comment': correct_comment,
            })

    update.effective_message.reply_text('Отправьте цену входного билета в рублях или /cancel', reply_markup=RKR())
    return State.CQUIZ_PRICE


def create_handler(update: Update, ctx: CallbackContext):
    ctx.user_data['cquiz'] = {
        'creator': ctx.user.pk,
    }
    buttons = [IKB(c.title, callback_data='cquiz_cat {}'.format(c.pk)) for c in QuizCategory.objects.all()]
    update.effective_message.edit_text('Выберите категорию для новой викторины или /cancel',
                                       reply_markup=IKM(buttons[i:i + 2] for i in range(0, len(buttons), 2)))


def category_handler(update: Update, ctx: CallbackContext):
    _, cid = update.callback_query.data.split()
    ctx.user_data['cquiz']['category'] = cid
    update.effective_message.reply_text('Отправьте наименование викторины или /cancel', reply_markup=RKR())
    return State.CQUIZ_TITLE
    

def title_handler(update: Update, ctx: CallbackContext):
    if len(update.effective_message.text) > 128:
        update.effective_message.reply_text('Название должно содержать максимум 128 знаков. '
                                            'Попробуйте еще раз или /cancel')
        return
    ctx.user_data['cquiz']['title'] = update.effective_message.text
    update.effective_message.reply_text('Отправьте описание викторины или /cancel')
    return State.CQUIZ_DESCRIPTION
    

def description_handler(update: Update, ctx: CallbackContext):
    if len(update.effective_message.text) > 4096:
        update.effective_message.reply_text('Описание должно содержать максимум 4096 знаков. '
                                            'Попробуйте еще раз или /cancel')
        return
    ctx.user_data['cquiz']['description'] = update.effective_message.text
    update.effective_message.reply_text('Отправьте цену входного билета в рублях или /cancel')
    return State.CQUIZ_PRICE


def price_handler(update: Update, ctx: CallbackContext):
    price = read_decimal(update)
    if price is None:
        update.effective_message.reply_text('Отправлена неверная сумма. Попробуйте еще раз или /cancel')
        return
    mep = global_preferences['general__minimal_entry_price']
    if price < mep:
        update.effective_message.reply_text('Цена входного билета должна быть более {:.2f} руб. '
                                            'Попробуйте еще раз или /cancel'.format(mep))
        return
    ctx.user_data['cquiz']['price'] = price
    markup = RKM([
        ['10', '30', '60'],
    ], resize_keyboard=True)
    update.effective_message.reply_markdown('Отправьте время, через которое викторина будет запущена, в минутах '
                                            'или /cancel', reply_markup=markup)
    return State.CQUIZ_STARTTIME


def starttime_handler(update: Update, ctx: CallbackContext):
    try:
        minutes = int(update.effective_message.text)
        if minutes < 1:
            update.effective_message.reply_markdown('Время должно быть больше или равно одной минуте. '
                                                    'Попробуйте еще раз или /cancel')
            return
        ctx.user_data['cquiz']['minutes'] = minutes
    except (TypeError, ValueError):
        update.effective_message.reply_markdown('Отправлено неверное время. Попробуйте еще раз или /cancel')

        return
    markup = RKM([
        ['15', '30', '60'],
    ], resize_keyboard=True)
    update.effective_message.reply_markdown('Отправьте время ответа на один вопрос в секундах или /cancel',
                                            reply_markup=markup)
    return State.CQUIZ_MAXLENGTH


def maxlength_handler(update: Update, ctx: CallbackContext):
    try:
        seconds = int(update.effective_message.text)
        if seconds < 15:
            update.effective_message.reply_markdown('Длительность должна быть больше или равна 15 секундам. '
                                                    'Попробуйте еще раз или /cancel')
            return
        ctx.user_data['cquiz']['question_length'] = seconds
    except (TypeError, ValueError):
        update.effective_message.reply_markdown('Отправлена неверная длительность. Попробуйте еще раз или /cancel')

        return
    update.effective_message.reply_markdown('Отправьте необходимое кол-во участников для старта или /cancel',
                                            reply_markup=RKR())
    return State.CQUIZ_MINPLAYERS


def minplayers_handler(update: Update, ctx: CallbackContext):
    try:
        players = int(update.effective_message.text)
        if players < 1:  # TODO
            update.effective_message.reply_markdown('Кол-во участников должно быть больше или равно двум. '
                                                    'Попробуйте еще раз или /cancel')
            return
        ctx.user_data['cquiz']['players'] = players
    except (TypeError, ValueError):
        update.effective_message.reply_markdown('Отправлено неверное число. Попробуйте еще раз или /cancel')

        return
    markup = RKM([
        [KB('Добавить вопрос', request_poll=KeyboardButtonPollType(Poll.QUIZ))],
        [Buttons.CANCEL],
        [Buttons.CQUIZ_FINISH],
    ], resize_keyboard=True)
    if 'copy_id' in ctx.user_data['cquiz']:
        return finish_questions_handler(update, ctx)
    else:
        ctx.user_data['cquiz']['questions'] = []
        update.effective_message.reply_text('Отправляйте опросы (quiz) для добавления вопросов или /cancel',
                                            reply_markup=markup)
        return State.CQUIZ_QUESTIONS


def question_handler(update: Update, ctx: CallbackContext):
    poll = update.effective_message.poll
    if poll.type != Poll.QUIZ:
        update.effective_message.reply_text('Опрос должен содержать правильный ответ')
        return
    ctx.user_data['cquiz']['questions'].append({'text': poll.question,
                                                'options': [opt.text for opt in poll.options],
                                                'answer': poll.correct_option_id})
    update.effective_message.reply_text('Вопрос сохранен. Отправьте новый опрос, завершите добавление или /cancel')


def finish_questions_handler(update: Update, ctx: CallbackContext):
    if 'copy_id' not in ctx.user_data['cquiz'] and not ctx.user_data['cquiz']['questions']:
        update.effective_message.reply_text('Викторина должна содежать хотя бы один вопрос')
        return
    serializer = CreateQuizSerializer(data=ctx.user_data['cquiz'], context={'request': ctx})
    serializer.is_valid()
    quiz = serializer.save()
    update.effective_message.reply_text('Викторина была успешно создана!')
    info, markup = render_quiz(quiz, ctx)
    update.effective_message.reply_text(info, reply_markup=markup)
    del ctx.user_data['cquiz']
    return main_menu(update, ctx)
