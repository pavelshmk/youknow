from dynamic_preferences.preferences import Section

general = Section('general')
bot_persistence = Section('bot_persistence')
api = Section('api')

from .bot_persistence import *
from .general import *
from .api import *
