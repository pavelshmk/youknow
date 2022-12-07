from telegram import Update
from telegram.ext import CallbackContext


def main_handler(update: Update, ctx: CallbackContext):
    update.effective_message.reply_text('Ваши достижения:\n\nTBD')
