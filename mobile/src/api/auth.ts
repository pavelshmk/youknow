import { AxiosInstance } from "axios";
import { Api } from "./index";

export class AuthApi {
    private parent: Api;
    private api: AxiosInstance;

    constructor(parent: Api, api: AxiosInstance) {
        this.parent = parent;
        this.api = api;
    }

    async phoneAuth(phone_number: string) {
        const r = await this.api.post('/auth/phone/', { phone_number });
    }

    async phoneAuthConfirm(phone_number: string, code: string, push_token: string) {
        const r = await this.api.post('/auth/phone/confirm/', { phone_number, code, push_token });
        return r.data.token;
    }

    async emailSignIn(email: string, password: string, push_token: string) {
        const r = await this.api.post('/auth/email/signin/', { email, password, push_token });
        return r.data.token;
    }

    async emailSignUp(email: string, password: string) {
        const r = await this.api.post('/auth/email/signup/', { email, password });
    }

    async emailSignUpConfirm(email: string, password: string, code: string, push_token: string) {
        const r = await this.api.post('/auth/email/signup/confirm/', { email, password, code });
        return r.data.token;
    }
}