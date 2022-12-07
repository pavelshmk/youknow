from dynamic_preferences.registries import global_preferences_registry
from dynamic_preferences.types import StringPreference

from . import bot_persistence


@global_preferences_registry.register
class BotData(StringPreference):
    section = bot_persistence
    name = 'bot_data'
    default = '{}'


@global_preferences_registry.register
class UserData(StringPreference):
    section = bot_persistence
    name = 'user_data'
    default = '{}'


@global_preferences_registry.register
class ChatData(StringPreference):
    section = bot_persistence
    name = 'chat_data'
    default = '{}'


@global_preferences_registry.register
class Conversations(StringPreference):
    section = bot_persistence
    name = 'conversations'
    default = '{}'



