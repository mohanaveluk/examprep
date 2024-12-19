export interface ModelExam {
    id: string;
    title: string;
    description: string;
    subject: string;
    totalQuestions: number;
    passingScore: number;
    createdAt?: Date;
    updatedAt?: Date;
  }