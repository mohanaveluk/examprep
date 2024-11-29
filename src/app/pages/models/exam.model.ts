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
  
  export interface Question {
    id: number;
    text: string;
    type: 'single' | 'multiple';
    options: Option[];
    maxSelections?: number;
  }
  
  export interface Option {
    id: number;
    text: string;
  }
  
