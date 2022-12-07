import { AsyncStorage } from 'react-native';

import { RootStore } from "./RootStore";
import { action, observable } from "mobx";
import api, { IProfile } from "../api";
import { Linking } from "expo";

const TOKEN_STORAGE_KEY = '@YouKnow/token';

export class AuthStore {
    private rootStore: RootStore;

    @observable phoneNumber: string;
    @observable email: string;
    private password: string;

    @observable token?: string;
    @observable profile?: IProfile;
    @observable pushToken?: string;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        AsyncStorage.getItem(TOKEN_STORAGE_KEY)
            .then(val => {
                if (!val)
                    return;
                api.token = this.token = val;
                this.loadProfile();
            })
            .catch(() => {});
    }

    @action private async signIn(token: string) {
        api.token = this.token = token;
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
        this.loadProfile();
    }

    @action async phoneAuth(phoneNumber: string) {
        this.phoneNumber = phoneNumber;
        await api.auth.phoneAuth(phoneNumber);
    }

    @action async phoneAuthConfirm(code: string) {
        const token = await api.auth.phoneAuthConfirm(this.phoneNumber, code, this.pushToken);
        this.signIn(token);
    }

    @action async emailSignIn(email: string, password: string) {
        const token = await api.auth.emailSignIn(email, password, this.pushToken);
        this.signIn(token);
    }

    @action async emailSignUp(email: string, password?: string) {
        if (!password)
            password = this.password;
        this.email = email;
        this.password = password;
        await api.auth.emailSignUp(email, password);
    }

    @action async emailSignUpConfirm(code: string) {
        const token = await api.auth.emailSignUpConfirm(this.email, this.password, code, this.pushToken);
        this.signIn(token);
    }

    @action async logout() {
        api.token = this.token = undefined;
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    @action async loadProfile() {
        this.profile = await api.users.profile();
    }

    @action async updateProfile(avatar: string, username: string) {
        this.profile = await api.users.updateProfile(avatar, username);
    }

    generateReferralUrl(quizPk: number) {
        return Linking.makeUrl('quiz', { pk: quizPk.toString(), ref: this.profile.pk.toString() });
    }

    @action setPushToken(val: string) {
        this.pushToken = val;
    }
}
