import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question, QuestionResult } from '../../models/exam.model';
import { ModelQuestionService } from '../model-question.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModelExamService } from '../model-exam.service';

interface SubjectContent {
  [key: string]: {
    content: string;
    keyPoints: string[];
    imageUrl?: string;
  };
}


@Component({
  selector: 'app-model-question-v2',
  templateUrl: './model-question-v2.component.html',
  styleUrl: './model-question-v2.component.scss'
})
export class ModelQuestionV2Component implements OnInit {
  examId: string = '';
  exam: any;
  currentQuestion: Question | null = null;
  selectedAnswers: number[] = [];
  questionResult: QuestionResult | null = null;
  isSubmitted = false;
  currentIndex = 0;
  totalQuestions = 0;
  startTime: number;
  subjectContent: SafeHtml = '';
  keyPoints: string[] = [];
  readonly QUESTIONS_PER_TEST = 10;

  error: string | null = null;
  warningMessage: string = "";
  loading = false;


  // Mock subject content - In real app, this would come from a service
  private subjectContents: SubjectContent = {
    'Anatomy': {
      content: `
        <p>Anatomy is the study of the structure of living things. It is a branch of natural science that deals with the structural organization of living things.</p>
        <img src="https://example.com/anatomy.jpg" alt="Anatomy diagram">
        <p>Understanding anatomy is crucial for medical professionals as it forms the foundation for understanding how the body works and how different systems interact.</p>
      `,
      keyPoints: [
        'Study of body structure',
        'Includes organs and systems',
        'Essential for medical diagnosis',
        'Basis for surgical procedures'
      ]
    },
    'Physiology': {
      content: `
        <p>Physiology is the study of how living systems function. It describes how organs, cells, and systems within an organism work together to maintain life.</p>
        <img src="https://example.com/physiology.jpg" alt="Physiology diagram">
        <p>Understanding physiology helps in diagnosing diseases and determining appropriate treatments.</p>
      `,
      keyPoints: [
        'Study of body functions',
        'Cellular processes',
        'System interactions',
        'Homeostasis maintenance'
      ]
    }
  };

  constructor(
    private modelExamService: ModelExamService,
    private modelQuestionService: ModelQuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.startTime = Date.now();
  }

  ngOnInit(): void {
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
    const examId = this.route.snapshot.params['examId'];
    this.modelQuestionService.getQuestion(examId, this.currentIndex).subscribe({
      next: (response: any) => {
        this.currentQuestion = response.data.question;
        this.totalQuestions = response.data.totalQuestions;
        this.resetQuestion();
        this.loadSubjectContent();
      },
      error: (error) => console.error('Failed to load question:', error)
    });
  }

  private loadSubjectContent() {
    if (this.currentQuestion) {
      const content = this.subjectContents[this.currentQuestion?.subject!];
      if (content) {
        this.subjectContent = this.sanitizer.bypassSecurityTrustHtml(content.content);
        this.keyPoints = content.keyPoints;
      }
    }
  }

  resetQuestion() {
    this.selectedAnswers = [];
    this.questionResult = null;
    this.isSubmitted = false;
  }

  onOptionSelect(optionId: number, checked: boolean) {
    if (checked) {
      this.selectedAnswers.push(optionId);
    } else {
      this.selectedAnswers = this.selectedAnswers.filter(id => id !== optionId);
    }
  }

  isOptionSelected(optionId: number): boolean {
    return this.selectedAnswers.includes(optionId);
  }

  isCorrectAnswer(optionId: number): boolean {
    return this.questionResult?.correctAnswers.includes(optionId) || false;
  }

  isIncorrectAnswer(optionId: number): boolean {
    return this.isSubmitted && 
           this.selectedAnswers.includes(optionId) && 
           !this.isCorrectAnswer(optionId);
  }

  onSubmit() {
    if (!this.currentQuestion || this.selectedAnswers.length === 0) return;
    const examId = this.route.snapshot.params['examId'];
    this.modelQuestionService.submitAnswer(
      examId,
      this.currentQuestion.id,
      this.selectedAnswers
    ).subscribe({
      next: (result) => {
        this.questionResult = result;
        this.isSubmitted = true;
      },
      error: (error) => console.error('Failed to submit answer:', error)
    });
  }

  next() {
    if (this.currentIndex < this.QUESTIONS_PER_TEST - 1) {
      this.currentIndex++;
      this.loadQuestion();
    }
  }

  get progressPercentage(): number {
    return ((this.currentIndex + 1) / this.QUESTIONS_PER_TEST) * 100;
  }
}
