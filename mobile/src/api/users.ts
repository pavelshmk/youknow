import { AxiosInstance } from "axios";
import { Api, IBalanceEvent, IParticipation, IProfile } from './index';

export class UsersApi {
    private parent: Api;
    private api: AxiosInstance;

    constructor(parent: Api, api: AxiosInstance) {
        this.parent = parent;
        this.api = api;
    }

    async profile(): Promise<IProfile> {
        const r = await this.api.get('/users/profile/', this.parent.config);
        return r.data;
    }

    async updateProfile(avatar: string, username: string): Promise<IProfile> {
        const r = await this.api.patch('/users/profile/', { avatar, username }, this.parent.config);
        return r.data;
    }

    async participationHistory(): Promise<IParticipation[]> {
        const r = await this.api.get('/users/profile/participations/', this.parent.config);
        return r.data;
    }

    async balanceEvents(): Promise<IBalanceEvent[]> {
        const r = await this.api.get('/users/balance/', this.parent.config);
        return r.data;
    }

    async deposit(amount: number, option: string) {
        const r = await this.api.post('/users/balance/deposit/', { amount, option }, this.parent.config);
    }

    async withdraw(amount: number, option: string, destination: string) {
        const r = await this.api.post('/users/balance/withdraw/', { amount, option, destination }, this.parent.config);
    }
}
