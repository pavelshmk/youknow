from dynamic_preferences.registries import global_preferences_registry
from dynamic_preferences.types import StringPreference
from . import api


@global_preferences_registry.register
class YandexKassaShopID(StringPreference):
    section = api
    name = 'yandex_kassa_shopid'
    default = ''


@global_preferences_registry.register
class YandexKassaSecretKey(StringPreference):
    section = api
    name = 'yandex_kassa_secretkey'
    default = ''
