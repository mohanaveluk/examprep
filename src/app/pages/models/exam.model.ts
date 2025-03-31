import { Category } from "../../shared/models/category.model";



export interface Exam {
  category?: Category;
  id: string;
  title: string;
  description: string;
  notes: string;
  categoryId: string,
  categoryText?: string,
  duration: number;
  totalQuestions: number;
  passingScore: number;
  createdAt: Date;
  updatedAt?: Date;
  status: number;
  questions?: Question[];
}

export interface StartExam {
  totalQuestions: number;
  duration: number;
  startTime: Date;
  endTime: Date;

}

export interface Question {
  id: number;
  text: string;
  type: 'single' | 'multiple' | 'true-false';
  options: OptionResponse[];
  maxSelections?: number;
  subject?: string;
}

export interface RandomQuestionResponse {
  id: number;
  question: string;
  type: string;
  options: OptionResponse[];
  isDeleted: boolean;
  qguid?: string;
  questionNumber: number;
  questionIndex: number;
  timeRemaining: number;
  totalQuestions: number;
  userAnswers: number[];
  reviewList: number[];
  subject: string;
}

export interface OptionResponse {
  id: number;
  text: string;
}

export interface ExamSession {
  id: string;
  examId: string;
  currentIndex: number;
  questionNumber: number;
  totalQuestions: number | 0;
  answeredQuestions: number | 0;
  status: 'not-started' | 'in-progress' | 'active' | 'paused' | 'completed';
  startTime?: Date;
  endTime?: Date;
  lastUpdated?: Date;
  pausedAt?: Date;
  totalPausedTime?: number;
  questionOrder?: number[];
  remainingTime?: number | 0;
  reviewList?: number[]
}


export interface ChartData {
  name: string;
  value: number;
  color: string;
}


export interface ExamResult {
  sessionId: string;
  exam: {
    id: string;
    title: string;
    description: string;
    duration: number;
    passingScore: number;
    category: {
      cguid: string;
      name: string;
      description: string;
    };
  };
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  passed: boolean;
  createdAt: string;
}

export interface ResultsStats {
  total: number;
  averageScore: number;
  passedCount: number;
  failedCount: number;
}

export interface QuestionResult {
  isCorrect: boolean;
  correctAnswers: number[];
  explanation: string;
}


export interface ModelExamResponse {
  success: boolean;
  message: string;
  data: Exam[];
}

export interface ModelExam {
  id: string;
  title: string;
  description: string;
  subject: string;
  totalQuestions: number;
  passingScore: number;
  is_active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}