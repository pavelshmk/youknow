from dynamic_preferences.registries import global_preferences_registry
from telegram import Bot, Update
from telegram.ext import Updater, CallbackContext, Filters
from telegram.utils.request import Request

from ._persistence import CustomPersistence
from ._utils import ConversationHandler, CommandHandler, State, CallbackQueryHandler, MessageHandler, main_menu, \
    Buttons, PollAnswerHandler
from .handlers import auth, cquiz, cabinet, achievements, quiz, funds

global_preferences = global_preferences_registry.manager()


def get_bot():
    return Bot(global_preferences.get_by_name('bot_token'), request=Request(8))


def start_handler(update: Update, ctx: CallbackContext):
    if len(update.effective_message.text) > 6 and update.effective_message.text.startswith('/start'):
        parts = update.effective_message.text.split()
        if len(parts) >= 2:
            qid, rid = parts[1][1:].split('_')
            ctx.user_data['referral'] = {'qid': qid, 'rid': rid}
    if ctx.user:
        return main_menu(update, ctx)
    return auth.main_handler(update, ctx)


def dummy_handler(update: Update, ctx: CallbackContext):
    update.callback_query.answer()


def get_updater():
    updater = Updater(bot=get_bot(), use_context=True, persistence=CustomPersistence())
    auth_states = {
        State.AUTH: [
            CallbackQueryHandler(auth.phone_handler, pattern=r'^auth_phone$'),
            CallbackQueryHandler(auth.email_handler, pattern=r'^auth_email$'),
        ],
        State.AUTH_PHONENUM: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text | Filters.contact, auth.phone_number_handler),
        ],
        State.AUTH_PHONECODE: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, auth.phone_code_handler),
        ],
        State.AUTH_EMAILADDR: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, auth.email_address_handler),
        ],
        State.AUTH_EMAILPASS: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, auth.email_password_handler),
        ],
        State.AUTH_EMAILCODE: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, auth.email_code_handler),
        ],
    }
    cquiz_handlers = {
        State.CQUIZ_TITLE: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, cquiz.title_handler),
        ],
        State.CQUIZ_DESCRIPTION: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, cquiz.description_handler),
        ],
        State.CQUIZ_PRICE: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, cquiz.price_handler),
        ],
        State.CQUIZ_MINPLAYERS: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, cquiz.minplayers_handler),
        ],
        State.CQUIZ_MAXLENGTH: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, cquiz.maxlength_handler),
        ],
        State.CQUIZ_STARTTIME: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, cquiz.starttime_handler),
        ],
        State.CQUIZ_QUESTIONS: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.regex(Buttons.CANCEL), start_handler),
            MessageHandler(Filters.poll, cquiz.question_handler),
            MessageHandler(Filters.text & Filters.regex(Buttons.CQUIZ_FINISH), cquiz.finish_questions_handler),
        ],
    }
    funds_handlers = {
        State.DEPOSIT_SUM: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, funds.deposit_sum_handler),
        ],
        State.WITHDRAW_SUM: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, funds.withdraw_sum_handler),
        ],
        State.WITHDRAW_DESTINATION: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, funds.withdraw_destination_handler),
        ],
    }
    cabinet_handlers = {
        State.CABINET_USERNAME: [
            CommandHandler('cancel', start_handler),
            MessageHandler(Filters.text, cabinet.username_text_handler),
        ]
    }
    updater.dispatcher.add_handler(ConversationHandler(
        entry_points=[CommandHandler(['start', 'menu'], start_handler, Filters.private, pass_args=True)],
        states={
            State.MAIN: [
                MessageHandler(Filters.regex(Buttons.CURRENT_QUIZZES), quiz.main_handler),
                MessageHandler(Filters.regex(Buttons.CABINET), cabinet.main_handler),
                MessageHandler(Filters.regex(Buttons.BALANCE), funds.main_handler),
                MessageHandler(Filters.regex(Buttons.DEPOSIT), funds.deposit_handler),
                MessageHandler(Filters.regex(Buttons.WITHDRAW), funds.withdraw_handler),
                MessageHandler(Filters.regex(Buttons.ACHIEVEMENTS), achievements.main_handler),
                MessageHandler(Filters.regex(Buttons.MENU), start_handler),

                MessageHandler(Filters.regex(Buttons.CREATE_QUIZ), cquiz.main_handler),
                CallbackQueryHandler(cquiz.copy_handler, pattern=r'^cquiz_copy$'),
                CallbackQueryHandler(cquiz.copy_category_handler, pattern=r'^cquiz_copycat (\d+) (\d+)$'),
                CallbackQueryHandler(cquiz.copy_quiz_handler, pattern=r'^cquiz_copyquiz (\d+)$'),
                CallbackQueryHandler(cquiz.create_handler, pattern=r'^cquiz_create$'),
                CallbackQueryHandler(cquiz.category_handler, pattern=r'^cquiz_cat (\d+)$'),

                CallbackQueryHandler(quiz.main_handler, pattern=r'^quiz_catlist$'),
                CallbackQueryHandler(quiz.mylist_handler, pattern=r'^quiz_mylist .+$'),
                CallbackQueryHandler(quiz.category_handler, pattern=r'^quiz_cat (\d+) (\d+)$'),
                CallbackQueryHandler(quiz.info_handler, pattern=r'^quiz_info (\d+)$'),
                CallbackQueryHandler(quiz.enter_handler, pattern=r'^quiz_enter (\d+)$'),
                CallbackQueryHandler(quiz.delete_handler, pattern=r'^quiz_delete (\d+)$'),

                CallbackQueryHandler(cabinet.places_handler, pattern=r'^cabinet_places$'),
                CallbackQueryHandler(cabinet.username_handler, pattern=r'^cabinet_username$'),
            ],
            **auth_states,
            **cquiz_handlers,
            **funds_handlers,
            **cabinet_handlers,
        },
        fallbacks=[
            CommandHandler(['start', 'menu'], start_handler, Filters.private),
        ],
        name='main',
        persistent=True
    ))
    updater.dispatcher.add_handler(CallbackQueryHandler(dummy_handler, pattern='^dummy$'))
    updater.dispatcher.add_handler(CallbackQueryHandler(quiz.start_handler, pattern='^quiz_start \d+$'))
    updater.dispatcher.add_handler(PollAnswerHandler(quiz.answer_handler))
    return updater
