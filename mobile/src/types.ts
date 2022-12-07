import { AuthStore, NavigationStore, SettingsStore } from "./stores";
import { ParamList } from "./Root";
import { StackNavigationProp } from "@react-navigation/stack";
import { QuizStore } from "./stores/QuizStore";

export interface IAuthStoreProps {
	authStore: AuthStore;
}

export interface INavigationStoreProps {
	navigationStore: NavigationStore;
}

export interface INavigationProps {
	navigation: StackNavigationProp<ParamList>;
}

export interface ISettingsStoreProps {
	settingsStore: SettingsStore;
}

export interface IQuizStoreProps {
	quizStore: QuizStore
}

export interface IAuthNavigationStoreProps extends IAuthStoreProps, INavigationProps {}

export interface ISettingsNavigationStoreProps extends ISettingsStoreProps, INavigationProps {}

export interface ISettingsNavigationQuizStoreProps extends ISettingsStoreProps, INavigationProps, IQuizStoreProps {}

export interface IAuthSettingsNavigationStoreProps extends ISettingsStoreProps, INavigationProps, IAuthStoreProps {}
