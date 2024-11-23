export interface ExamQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface ExamData {
  examTitle: string;
  description: string;
  questions: ExamQuestion[];
}