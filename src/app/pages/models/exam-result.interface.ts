export interface ExamQuestion {
    questionId: number;
    question: string;
    type: 'single' | 'multiple' | 'true-false' | 'ranking';
    selectedOptions: string[];
    correctOptions: number[];
    isCorrect: boolean;
  }
  
  export interface ExamResult {
    sessionId: string;
    totalQuestions: number;
    correctAnswers: number;
    scorePercentage: number;
    passed: boolean;
    recommendations: "",
    sectionScores?: Section[],
    questions: ExamQuestion[];
    exam: ExamInfo

  }

  export interface ExamInfo {
    id: number,
    title: string,
    description: string,
    duration: number,
    passingScore: number,
    category: CategoryInfo;
  }

  export interface CategoryInfo {
    cguid: string,
    name: string,
    description: string,
  }

  export interface Section {
    name?: string,
    score?: number,
    feedback?: string
  }