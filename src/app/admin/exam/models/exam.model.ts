export enum QuestionType {
  SINGLE_CHOICE = 'single',
  MULTIPLE_CHOICE = 'multiple',
  TRUE_FALSE = 'true-false',
  ORDERING = 'ranking'
}

export interface ExamQuestion {
  question: string;
  options: string[];
  correctAnswers: number[];
  type: QuestionType;
  order?: number[];  // For ordering questions
}

export interface ExamData {
  examTitle: string;
  description: string;
  questions: ExamQuestion[];
}



export interface CreateExamDto {
  title: string;
  description: string;
  subject: string;
  totalQuestions: number;
  passingScore: number;
}

export interface UpdateExamDto {
  title?: string;
  description?: string;
  subject?: string;
  totalQuestions?: number;
  passingScore?: number;
}