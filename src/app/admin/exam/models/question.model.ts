export interface Question {
    id: number;
    question: string;
    type: 'single' | 'multiple' | 'true-false' | 'ranking';
    options: string[];
    correctAnswers: number[];
    isDeleted: boolean;
    order?: number[];
  }