export interface Question {
    id: number;
    question: string;
    type: 'single' | 'multiple' | 'true-false' | 'ranking';
    options: string[];
    correctAnswers: number[];
    isDeleted: boolean;
    order?: number[];
    qguid?: string;
  }

  export interface QuestionResponse {
    id: number;
    question: string;
    type: string;
    options: QuestionOption[];
    correctAnswers: number[];
    isDeleted: boolean;
    order?: number[];
    qguid?: string;
  }

  export interface QuestionOption{
    id: number;
    text: string;
  }