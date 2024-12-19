import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question, QuestionResult } from '../../models/exam.model';
import { ModelQuestionService } from '../model-question.service';
import { ModelExamService } from '../model-exam.service';

interface QuestionAttempt {
  question: Question;
  selectedAnswers: number[];
  result: QuestionResult;
}

interface SectionScore {
  name: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

interface TestSummary {
  examTitle: string;
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  sectionScores: SectionScore[];
}

@Component({
  selector: 'app-model-question',
  templateUrl: './model-question.component.html',
  styleUrl: './model-question.component.scss'
})
export class ModelQuestionComponent implements OnInit{
  examId: string = '';
  exam: any;
  currentQuestion: Question | null = null;
  selectedAnswers: number[] = [];
  questionResult: QuestionResult | null = null;
  isSubmitted = false;
  currentIndex = 0;
  totalQuestions = 0;
  error: string | null = null;
  
  startTime!: number;
  questionAttempts: QuestionAttempt[] = [];
  testSummary: TestSummary | null = null;
  isCompleted = false;
  showSummary = false;
  readonly QUESTIONS_PER_TEST = 10;

  warningMessage: string = "";
  loading = false;

  constructor(
    private modelExamService: ModelExamService,
    private modelQuestionService: ModelQuestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.startTime = Date.now();
  }

  ngOnInit() {
    this.examId = this.route.snapshot.params['examId'];
    this.loadExam(this.examId);
    this.loadQuestion();
  }

  loadExam(examId: string) {
    this.loading = true;
    this.modelExamService.getExam(examId).subscribe({
      next: (response: any) => {
        if(response.success){
          this.exam = response.data;
        }
        else{
          this.warningMessage = "No exam found at this moment..."
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load exam. Please try again later.';
        console.error('Failed to load exam:', error);
      }
    });
  }

  loadQuestion() {
    this.loading = true;
    const examId = this.route.snapshot.params['examId'];
    this.modelQuestionService.getQuestion(examId, this.currentIndex).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.currentQuestion = response.data.question;
        this.totalQuestions = response.data.totalQuestions;
        this.resetQuestion();
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load question. Please try again later.';
        console.error('Failed to load question:', error)
      }
    });
  }

  resetQuestion() {
    this.selectedAnswers = [];
    this.questionResult = null;
    this.isSubmitted = false;
  }

  onOptionSelect(optionId: number) {
    if (this.isSubmitted) return;

    if (this.currentQuestion?.type === 'single') {
      this.selectedAnswers = [optionId];
    } else {
      const index = this.selectedAnswers.indexOf(optionId);
      if (index === -1) {
        if (!this.currentQuestion?.maxSelections || 
            this.selectedAnswers.length < this.currentQuestion.maxSelections) {
          this.selectedAnswers.push(optionId);
        }
      } else {
        this.selectedAnswers.splice(index, 1);
      }
    }
  }

  isOptionSelected(optionId: number): boolean {
    return this.selectedAnswers.includes(optionId);
  }

  getOptionClass(optionId: number): string {
    if (!this.isSubmitted) return '';

    const isSelected = this.isOptionSelected(optionId);
    const isCorrect = this.questionResult?.correctAnswers.includes(optionId);

    if (isSelected && isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    if (!isSelected && isCorrect) return 'correct highlight';
    
    return '';
  }

  onSubmit() {
    if (!this.currentQuestion || this.selectedAnswers.length === 0) return;
    const examId = this.route.snapshot.params['examId'];
    this.modelQuestionService.submitAnswer(
      examId,
      this.currentQuestion.id,
      this.selectedAnswers
    ).subscribe({
      next: (result: any) => {
        this.questionResult = result.data;
        this.isSubmitted = true;
        this.storeQuestionAttempt();
        
        if (this.questionAttempts.length === this.QUESTIONS_PER_TEST || this.questionAttempts.length === this.totalQuestions) {
          this.isCompleted = true; //this.generateTestSummary();
        }
      },
      error: (error) => console.error('Failed to submit answer:', error)
    });
  }

  private storeQuestionAttempt() {
    if (this.currentQuestion && this.questionResult) {
      this.questionAttempts.push({
        question: this.currentQuestion,
        selectedAnswers: this.selectedAnswers,
        result: this.questionResult
      });
    }
  }

  private generateTestSummary() {
    const correctAnswers = this.questionAttempts.filter(
      attempt => attempt.result.isCorrect
    ).length;

    const totalScore = (correctAnswers / (this.totalQuestions >= this.QUESTIONS_PER_TEST ? this.QUESTIONS_PER_TEST: this.totalQuestions)) * 100;
    const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);

    // Group questions by subject/section
    const sectionScores = this.calculateSectionScores();

    this.testSummary = {
      examTitle: 'Model Test',
      totalScore,
      totalQuestions: (this.totalQuestions >= this.QUESTIONS_PER_TEST) ? this.QUESTIONS_PER_TEST : this.totalQuestions,
      correctAnswers,
      timeTaken,
      sectionScores
    };

    this.showSummary = true;
  }

  private calculateSectionScores(): SectionScore[] {
    const sectionMap = new Map<string, { correct: number, total: number }>();

    this.questionAttempts.forEach(attempt => {
      const section = attempt.question.subject || 'General';
      const current = sectionMap.get(section) || { correct: 0, total: 0 };
      
      sectionMap.set(section, {
        correct: current.correct + (attempt.result.isCorrect ? 1 : 0),
        total: current.total + 1
      });
    });

    return Array.from(sectionMap.entries()).map(([name, stats]) => ({
      name,
      score: (stats.correct / stats.total) * 100,
      totalQuestions: stats.total,
      correctAnswers: stats.correct
    }));
  }


  next() {
    if (this.currentIndex < this.totalQuestions - 1 || (this.totalQuestions >= this.QUESTIONS_PER_TEST && this.currentIndex < this.QUESTIONS_PER_TEST - 1)) {
      this.currentIndex++;
      this.loadQuestion();
    } else {
      //this.router.navigate(['/exam/list']);
    }
  }

  get progressPercentage(): number {
    return ((this.currentIndex + 1) / ((this.totalQuestions >= this.QUESTIONS_PER_TEST) ? this.QUESTIONS_PER_TEST : this.totalQuestions)) * 100;
  }

  summary(){
    this.generateTestSummary();
  }

  tryAgain(): void {
    // Navigate to start a new test
    this.router.navigate(['/exam/trial']);
  }
}
