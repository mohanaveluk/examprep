import { Category } from "../../shared/models/category.model";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

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
    type: 'single' | 'multiple';
    options: OptionResponse[];
    maxSelections?: number;
  }

  export interface RandomQuestionResponse {
    id: number;
    question: string;
    type: string;
    options: OptionResponse[];
    isDeleted: boolean;
    qguid?: string;
    questionNumber: number;
    timeRemaining: number;
    totalQuestions: number;
  }
  
  export interface OptionResponse {
    id: number;
    text: string;
  }
  
  export interface ExamSession {
    examId: string;
    currentIndex: number;
    questionNumber: number;
    totalQuestions: number | 0;
    answeredQuestions: number | 0;
    status: 'not-started' | 'in-progress' | 'active' |'paused' | 'completed';
    startTime?: Date;
    endTime?: Date;
    lastUpdated?: Date;
    pausedAt?: Date;
    totalPausedTime?: number;
    questionOrder?: number;
    remainingTime?: number | 0;
  }