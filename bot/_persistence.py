from collections import defaultdict
from copy import deepcopy

import yaml
from dynamic_preferences.registries import global_preferences_registry
from telegram.ext import BasePersistence


global_preferences = global_preferences_registry.manager()


def decode_user_chat_data_from_yaml(data):
    tmp = defaultdict(dict)
    decoded_data = yaml.load(data, Loader=yaml.CLoader)
    for user, data in decoded_data.items():
        user = int(user)
        tmp[user] = {}
        for key, value in data.items():
            try:
                key = int(key)
            except ValueError:
                pass
            tmp[user][key] = value
    return tmp


def decode_conversations_from_yaml(yaml_string):
    tmp = yaml.load(yaml_string, Loader=yaml.CLoader)
    conversations = {}
    for handler, states in tmp.items():
        conversations[handler] = {}
        for key, state in states.items():
            conversations[handler][tuple(yaml.load(key, Loader=yaml.CLoader))] = state
    return conversations


def encode_conversations_to_yaml(conversations):
    tmp = {}
    for handler, states in conversations.items():
        tmp[handler] = {}
        for key, state in states.items():
            tmp[handler][yaml.dump(key, Dumper=yaml.CDumper)] = state
    return yaml.dump(tmp, Dumper=yaml.CDumper)


class CustomPersistence(BasePersistence):
    def __init__(self):
        super().__init__()
        self.bot_data = None
        self.user_data = None
        self.chat_data = None
        self.conversations = None

    def load(self):
        try:
            self.bot_data = yaml.load(global_preferences.get_by_name('bot_data'), Loader=yaml.CLoader)
            self.user_data = decode_user_chat_data_from_yaml(global_preferences.get_by_name('user_data'))
            self.chat_data = decode_user_chat_data_from_yaml(global_preferences.get_by_name('chat_data'))
            self.conversations = decode_conversations_from_yaml(global_preferences.get_by_name('conversations'))
        except yaml.YAMLError:
            raise TypeError("Saved persistence YAML is invalid")
        except Exception:
            raise TypeError("Something went wrong decoding persistence YAML")

    def get_bot_data(self):
        if not self.bot_data:
            self.load()
        return deepcopy(self.bot_data)

    def get_user_data(self):
        if not self.user_data:
            self.load()
        return deepcopy(self.user_data)

    def get_chat_data(self):
        if not self.chat_data:
            self.load()
        return deepcopy(self.chat_data)

    def get_conversations(self, name):
        if not self.conversations:
            self.load()
        return self.conversations.get(name, {}).copy()

    def update_conversation(self, name, key, new_state):
        if self.conversations.setdefault(name, {}).get(key) == new_state:
            return
        self.conversations[name][key] = new_state
        self.flush()

    def update_bot_data(self, data):
        if self.bot_data == data:
            return
        self.bot_data = data
        self.flush()

    def update_user_data(self, user_id, data):
        if self.user_data.get(user_id) == data:
            return
        self.user_data[user_id] = data
        self.flush()

    def update_chat_data(self, chat_id, data):
        if self.chat_data.get(chat_id) == data:
            return
        self.chat_data[chat_id] = data
        self.flush()

    def flush(self):
        if self.bot_data:
            global_preferences['bot_persistence__bot_data'] = yaml.dump(self.bot_data, Dumper=yaml.CDumper)
        if self.user_data:
            global_preferences['bot_persistence__user_data'] = yaml.dump(self.user_data, Dumper=yaml.CDumper)
        if self.chat_data:
            global_preferences['bot_persistence__chat_data'] = yaml.dump(self.chat_data, Dumper=yaml.CDumper)
        if self.conversations:
            global_preferences['bot_persistence__conversations'] = encode_conversations_to_yaml(self.conversations)
