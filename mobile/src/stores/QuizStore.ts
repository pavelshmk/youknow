import { RootStore } from "./RootStore";
import { action, observable } from "mobx";
import api, { ICategory, ICreateQuizData, IFoundation, IQuiz, IQuizFilters } from "../api";

export class QuizStore {
    rootStore: RootStore;

    @observable categoriesMap: { [pk: number]: ICategory } = {};
    @observable categories: ICategory[] = [];
    @observable foundationsMap: { [pk: number]: IFoundation } = {};
    @observable foundations: IFoundation[] = [];

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        this.loadCategories();
        this.loadFoundations();
    }

    @action async loadCategories() {
        this.categories = await api.quiz.categories();
        this.categoriesMap = this.categories.reduce((acc, cat) => { acc[cat.pk] = cat; return acc; }, {});
    }

    @action async loadFoundations() {
        this.foundations = await api.quiz.foundations();
        this.foundationsMap = this.foundations.reduce((acc, fnd) => { acc[fnd.pk] = fnd; return acc; }, {});
    }

    async createQuiz(data: ICreateQuizData): Promise<IQuiz> {
        return await api.quiz.createQuiz(data);
    }

    async list(filters?: IQuizFilters): Promise<IQuiz[]> {
        return await api.quiz.list(filters);
    }
}
