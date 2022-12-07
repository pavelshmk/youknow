from telegram import Update, ReplyKeyboardRemove as RKR, ReplyKeyboardMarkup as RKM
from telegram.ext import CallbackContext

from bot._utils import State, main_menu, Buttons
from users.models import WithdrawRequest, BalanceEvent, BalanceEventType, Deposit
from youknow.cardvalidate import check_valid_card
from youknow.utils import read_decimal


def main_handler(update: Update, ctx: CallbackContext):
    markup = RKM([
        [Buttons.DEPOSIT, Buttons.WITHDRAW],
        [Buttons.MENU]
    ], resize_keyboard=True)
    result = []
    for evt in ctx.user.balance_events.order_by('-id')[:10]:  # type: BalanceEvent
        if evt.type == BalanceEventType.WITHDRAW:
            result.append('ꞏ Вывод {:.2f} руб.'.format(evt.amount))
        elif evt.type == BalanceEventType.DEPOSIT:
            result.append('ꞏ Пополнение на {:.2f} руб.'.format(evt.amount))
        elif evt.type == BalanceEventType.FIRST_PLACE:
            result.append('ꞏ Выигрыш {:.2f} руб (первое место)'.format(evt.amount))
        elif evt.type == BalanceEventType.SECOND_PLACE:
            result.append('ꞏ Выигрыш {:.2f} руб (второе место)'.format(evt.amount))
        elif evt.type == BalanceEventType.THIRD_PLACE:
            result.append('ꞏ Выигрыш {:.2f} руб (третье место)'.format(evt.amount))
        elif evt.type == BalanceEventType.REFERRAL:
            result.append('ꞏ Реферальный бонус {:.2f} руб'.format(evt.amount))
        elif evt.type == BalanceEventType.CREATOR:
            result.append('ꞏ Авторский бонус {:.2f} руб'.format(evt.amount))
    update.effective_message.reply_text('Баланс: {:.2f} руб\n\n'.format(ctx.user.balance) +
                                        'Последние 10 операций:\n\n' + '\n'.join(result), reply_markup=markup)


def deposit_handler(update: Update, ctx: CallbackContext):
    update.effective_message.reply_text('Отправьте сумму пополнения или /cancel', reply_markup=RKR())
    return State.DEPOSIT_SUM


def deposit_sum_handler(update: Update, ctx: CallbackContext):
    deposit_sum = read_decimal(update)
    if deposit_sum is None or deposit_sum <= 0:
        update.effective_message.reply_text('Отправлена неверная сумма пополнения. Попробуйте еще раз или /cancel')
        return
    # ctx.user.balance += deposit_sum
    # ctx.user.save()
    # update.effective_message.reply_text(
    #     '[Здесь должна быть ссылка на Я.Кассу] Баланс был пополнен на {:.2f} руб.'.format(deposit_sum)
    # )
    deposit, url = Deposit.create(ctx.user, deposit_sum)
    update.effective_message.reply_text('Ссылка для пополнения: {}\n'
                                        'У вас есть 30 минут на оплату'.format(url))
    # BalanceEvent.objects.create(user=ctx.user, type=BalanceEventType.DEPOSIT, amount=deposit_sum)
    return main_menu(update, ctx)


def withdraw_handler(update: Update, ctx: CallbackContext):
    update.effective_message.reply_text('Отправьте сумму для вывода или /cancel', reply_markup=RKR())
    return State.WITHDRAW_SUM


def withdraw_sum_handler(update: Update, ctx: CallbackContext):
    withdraw_sum = read_decimal(update)
    if withdraw_sum is None or withdraw_sum <= 0:
        update.effective_message.reply_text('Отправлена неверная сумма для вывода. Попробуйте еще раз или /cancel')
        return
    if withdraw_sum < ctx.user.balance:
        update.effective_message.reply_text('Недостаточно средств на счету. Попробуйте еще раз или /cancel')
        return
    ctx.user_data['withdraw_sum'] = withdraw_sum
    update.effective_message.reply_text('Отправьте номер карты (мы поддерживаем Visa и MasterCard) для вывода или /cancel')
    return State.WITHDRAW_DESTINATION


def withdraw_destination_handler(update: Update, ctx: CallbackContext):
    if not check_valid_card(update.effective_message.text):
        update.effective_message.reply_text('Некорректный номер карты, попробуйте еще раз или /cancel')
        return

    withdraw_sum = ctx.user_data['withdraw_sum']
    wr = WithdrawRequest.objects.create(user=ctx.user, amount=withdraw_sum,
                                        destination=update.effective_message.text)
    ctx.user.balance -= withdraw_sum
    ctx.user.save()
    update.effective_message.reply_text(
        'Заявка на вывод {:.2f} руб. #{} была создана'.format(withdraw_sum, wr.pk)
    )
    BalanceEvent.objects.create(user=ctx.user, type=BalanceEventType.WITHDRAW, amount=withdraw_sum)
    return main_menu(update, ctx)
