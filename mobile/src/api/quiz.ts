import {
    Api,
    ICategory,
    ICreateQuizData, IFoundation,
    IFullQuiz,
    IMyQuizzesResponse,
    INextQuestionResponse,
    IQuiz, IQuizFilters,
    IQuizResultsResponse
} from "./index";
import { AxiosInstance } from "axios";

export class QuizApi {
    private parent: Api;
    private api: AxiosInstance;

    constructor(parent: Api, api: AxiosInstance) {
        this.parent = parent;
        this.api = api;
    }

    async categories(): Promise<ICategory[]> {
        const r = await this.api.get('/quiz/categories/');
        return r.data;
    }

    async foundations(): Promise<IFoundation[]> {
        const r = await this.api.get('/quiz/foundations/');
        return r.data;
    }

    async createQuiz(data: ICreateQuizData): Promise<IQuiz> {
        const r = await this.api.post('/quiz/create/', data, this.parent.config);
        return r.data;
    }

    async list(filters?: IQuizFilters): Promise<IQuiz[]> {
        const r = await this.api.get('/quiz/', { ...this.parent.config, params: filters });
        return r.data;
    }

    async details(pk: number): Promise<IFullQuiz> {
        const r = await this.api.get(`/quiz/${pk}/`, this.parent.config);
        return r.data;
    }

    async delete(pk: number): Promise<IFullQuiz> {
        const r = await this.api.delete(`/quiz/${pk}/`, this.parent.config);
        return r.data;
    }

    async participate(pk: number): Promise<IFullQuiz> {
        const r = await this.api.post(`/quiz/${pk}/participate/`, {}, this.parent.config);
        return r.data;
    }

    async myQuizzes(): Promise<IMyQuizzesResponse> {
        const r = await this.api.get('/quiz/my/', this.parent.config);
        return r.data;
    }

    async nextQuestion(pk: number): Promise<INextQuestionResponse> {
        const r = await this.api.get(`/quiz/${pk}/questions/`, this.parent.config);
        return r.data;
    }

    async submitResponse(quiz: number, response: number): Promise<INextQuestionResponse> {
        const r = await this.api.post(`/quiz/${quiz}/questions/`, { response }, this.parent.config);
        return r.data;
    }

    async results(quiz: number): Promise<IQuizResultsResponse> {
        const r = await this.api.get(`/quiz/${quiz}/results/`, this.parent.config);
        return r.data;
    }
}
