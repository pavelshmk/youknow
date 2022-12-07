import { AuthStore } from "./AuthStore";
import { NavigationStore } from "./NavigationStore";
import { SettingsStore } from "./SettingsStore";
import { QuizStore } from "./QuizStore";

export class RootStore {
    authStore: AuthStore;
    navigationStore: NavigationStore;
    settingsStore: SettingsStore;
    quizStore: QuizStore;

    constructor() {
        this.authStore = new AuthStore(this);
        this.navigationStore = new NavigationStore(this);
        this.settingsStore = new SettingsStore(this);
        this.quizStore = new QuizStore(this);

        return {
            authStore: this.authStore,
            navigationStore: this.navigationStore,
            settingsStore: this.settingsStore,
            quizStore: this.quizStore,
        }
    }
}
