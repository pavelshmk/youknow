from decimal import Decimal

from dynamic_preferences.registries import global_preferences_registry
from dynamic_preferences.types import StringPreference, DecimalPreference, IntegerPreference

from . import general


@global_preferences_registry.register
class BotToken(StringPreference):
    section = general
    name = 'bot_token'
    required = True
    default = ''


@global_preferences_registry.register
class QuizBankCommission(DecimalPreference):
    section = general
    name = 'quiz_bank_commission'
    required = True
    default = Decimal('.1')


@global_preferences_registry.register
class QuizAuthorCommission(DecimalPreference):
    section = general
    name = 'quiz_author_commission'
    required = True
    default = Decimal('.1')


@global_preferences_registry.register
class MinimalEntryPrice(DecimalPreference):
    section = general
    name = 'minimal_entry_price'
    required = True
    default = Decimal('50')


@global_preferences_registry.register
class ReferralBonus(DecimalPreference):
    section = general
    name = 'referral_bonus'
    required = True
    default = Decimal('.1')


@global_preferences_registry.register
class FirstPlaceProportion(IntegerPreference):
    section = general
    name = '1st_place_proportion'
    required = True
    default = 5


@global_preferences_registry.register
class SecondPlaceProportion(IntegerPreference):
    section = general
    name = '2nd_place_proportion'
    required = True
    default = 3


@global_preferences_registry.register
class ThirdPlaceProportion(IntegerPreference):
    section = general
    name = '3rd_place_proportion'
    required = True
    default = 2


@global_preferences_registry.register
class NotificationDelta(IntegerPreference):
    section = general
    name = 'notification_delta'
    required = True
    default = 3
