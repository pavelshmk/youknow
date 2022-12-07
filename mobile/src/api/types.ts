export type BlockReason = 'already_participating' | 'insufficient_funds' | 'already_finished' | 'already_started' | 'is_creator' | 'already_played';

export interface IUser {
    pk: number;
    name: string;
    avatar: string;
}

export interface IProfile {
    pk: number;
    username: string | null;
    name: string;
    email: string;
    phone_number: string;
    balance: string;
    wins: number;
    avatar: string;
}

export interface ICategory {
    pk: number;
    title: string;
    image: string;
    count: number;
}

export interface IFoundation {
    pk: number;
    title: string;
}

export interface IQuiz {
    pk: number;
    title: string;
    players: number;
    start_players: number;
    start_datetime: number;
    bank: string;
    entry_price: string;
    category: ICategory;
    creator: IUser;
}

export interface IFullQuiz extends IQuiz {
    description: string;
    owner: IUser;
    participations: IParticipation[];
    block_reason?: BlockReason;
    participating: boolean;
    editable: boolean;
    deleted: boolean;
    questions?: any;
    foundation?: IFoundation;
}

export interface IParticipation {
    pk: number;
    quiz: IQuiz;
    place: number;
    win: string;
    user: IUser;
}

export interface IBalanceEvent {
    pk: number;
    type: 'deposit' | 'withdraw' | '1stplace' | '2ndplace' | '3rdplace' | 'referral' | 'creator';
    amount: string;
    time: string;
    quiz: IQuiz | null;
}

export interface ICreateQuizQuestionData {
    text: string;
    answer: number;
    options: string[];
    correct_comment?: string;
    image?: string;
}

export interface ICreateQuizData {
    foundation: number;
    category: number;
    title: string;
    description: string;
    price: string;
    minutes: number;
    players: number;
    question_length: number;
    questions: ICreateQuizQuestionData[];
    sponsor?: string;
    creator?: number;
    copy_id?: number;
}

export interface IMyQuizzesResponse {
    creator: IQuiz[];
    owner: IQuiz[];
    future: IQuiz[];
    current: IQuiz[];
}

export interface INextQuestionResponse {
    question?: {
        pk: number;
        text: string;
        image?: string;
        options: {
            pk: number;
            text: string;
        }[];
    },
    finish_time: string;
    total_questions: number;
    questions_left: number;
    players: number;
    players_finished: number;
    finished: boolean;
}

export interface IQuizResultsResponse {
    place: number;
    win: number;
    ranking: {
        user: IUser,
        points: number;
        time: number;
    }[],
    answers: {
        question: string;
        answer: string;
        is_correct: boolean;
        correct: string;
        correct_comment: string;
    }[];
}

export interface IQuizFilters {
    category?: number;
    search?: string;
    price_start?: number;
    price_end?: number;
    bank_start?: number;
    bank_end?: number;
}