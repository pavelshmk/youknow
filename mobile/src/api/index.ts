import axios, { AxiosError } from 'axios';
import { AuthApi } from "./auth";
import { UsersApi } from "./users";
import { QuizApi } from "./quiz";

class Api {
    auth: AuthApi;
    users: UsersApi;
    quiz: QuizApi;
    token?: string;

    constructor() {
        const api = axios.create({
            baseURL: 'http://157.245.133.231/api',
        });
        api.interceptors.response.use(
            response => response,
            error => {
                if (error.isAxiosError) {
                    if ((error as AxiosError).response.data) {
                        console.warn((error as AxiosError).response.data);
                    }
                }
                console.warn(error);
            }
        );
        this.auth = new AuthApi(this, api);
        this.users = new UsersApi(this, api);
        this.quiz = new QuizApi(this, api);
        // this.token = require('../stores').rootStore.authStore.token;
    }

    get config() {
        return { headers: { authorization: `Token ${this.token}` } };
    }
}

export default new Api();
export { Api };
export * from './types';
