export interface Question {
    id: number;
    question: string;
    type: 'single' | 'multiple' | 'true-false';
    options: string[];
    correctAnswers: number[];
    isDeleted: boolean;
  }