import { action, computed, observable } from "mobx";
import { DefaultTheme } from "react-native-paper";
import { RootStore } from "./RootStore";
import { Fonts } from "react-native-paper/src/types";
import { AsyncStorage } from "react-native";

type Theme = {
  dark: boolean;
  mode?: 'adaptive' | 'exact';
  roundness: number;
  colors: {
    primary: string;
    background: string;
    surface: string;
    accent: string;
    error: string;
    onSurface: string;
    onBackground: string;
    disabled: string;
    placeholder: string;
    backdrop: string;
    bg1: string;
    bg2: string;
    input: string;
    card: string;
    text: string;
    gradient: string;
    border: string;
    bar: string;
  };
  fonts: Fonts;
  animation: {
    scale: number;
  };
};

const DarkTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        bg1: '#060A10',
        bg2: '#19232F',
        input: '#060A10',
        card: '#19232F',
        text: '#FFFFFF',
        gradient: 'rgba(9, 18, 28, 1)',
        border: '#19232F',
        bar:'#060A10',
        primary: '#FF3358',
    }
};

const LightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        bg1: '#2A2D36',
        bg2: '#222327',
        input: '#2A2D36',
        card: '#FFFFFF',
        text: '#222327',
        gradient: '#313745',
        border: '#545964',
        bar:'#222327',
        primary: '#FF3358',
    }
};

const DARK_THEME_STORAGE_KEY = '@YouKnow/darkTheme';
const NOTIFICATIONS_STORAGE_KEY = '@YouKnow/notifications';
const SEARCH_LOG_STORAGE_KEY = '@YouKnow/searchLog';

export class SettingsStore {
    private rootStore: RootStore;

    @observable darkTheme: boolean = true;
    @observable notifications: boolean = true;
    @observable searchLog: string[] = [];

    @computed get theme(): Theme {
        return this.darkTheme ? DarkTheme : LightTheme;
    }

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        AsyncStorage.getItem(DARK_THEME_STORAGE_KEY)
            .then(val => {
                if (!val)
                    return;
                this.darkTheme = val != 'false';
            })
            .catch(() => {});

        AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
            .then(val => {
                if (!val)
                    return;
                this.notifications = val != 'false';
            })
            .catch(() => {});

        AsyncStorage.getItem(SEARCH_LOG_STORAGE_KEY)
            .then(val => {
                if (!val)
                    return;
                this.searchLog = JSON.parse(val);
            })
            .catch(() => {});
    }

    @action async updateDarkTheme(val: boolean) {
        this.darkTheme = val;
        await AsyncStorage.setItem(DARK_THEME_STORAGE_KEY, val.toString());
    }

    @action async updateNotifications(val: boolean) {
        this.notifications = val;
        await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, val.toString());
    }

    @action async addSearchLogEntry(val: string) {
        if (this.searchLog.includes(val)) return;
        this.searchLog = [val].concat(this.searchLog).slice(0, 2);
        await AsyncStorage.setItem(SEARCH_LOG_STORAGE_KEY, JSON.stringify(this.searchLog));
    }
}