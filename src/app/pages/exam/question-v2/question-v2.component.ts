import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ModelQuestionService } from '../model-question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Exam, ExamSession, RandomQuestionResponse } from '../../models/exam.model';
import { ExamTiming } from '../../../core/services/exam-state.service';
import { Subscription } from 'rxjs';

interface SubjectContent {
  [key: string]: {
    content: string;
    keyPoints: string[];
    imageUrl?: string;
  };
}

@Component({
  selector: 'app-question-v2',
  templateUrl: './question-v2.component.html',
  styleUrl: './question-v2.component.scss'
})
export class QuestionV2Component  implements OnInit, OnDestroy{
  examId: string = '';
    currentQuestion: RandomQuestionResponse | null = null;
    currentIndex: number = 0;
    questionNumber: number = 0;
    totalQuestions: number = 0;
    totalAnsweredQuestions: number = 0;
    selectedAnswers: { [key: number]: number | number[] } = {};
    direction: string = "";
    exam!: Exam;
    reviewList: number[] = [];
    examTiming: ExamTiming | null = null;
    remainingTime: number = 0;
    session: ExamSession | undefined;
    selectedOption: number[] = [];
    private timerInterval: any = null;
    private examTimingSubscription: Subscription | null = null;
    private timerSubscription?: Subscription;
    private sessionSubscription?: Subscription;
    private inactivitySubscription?: Subscription;
  
    public warningMessage: string = ""
    public remainingTimeMessage: string = ""
    public errorMessage: string = ""
    private timeText: string = "";

    startTime: number = 0;
    subjectContent: SafeHtml = '';
    keyPoints: string[] = [];
    readonly QUESTIONS_PER_TEST = 10;
    
   // Divider dragging properties
   isDragging = false;
   questionSectionWidth = 800; // Initial width
   private startX = 0;
   private startWidth = 0;

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
    private modelQuestionService: ModelQuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    //this.loadQuestion();
    this.examId = this.route.snapshot.params['id'];
    this.loadSubjectContent();
  }

  ngOnDestroy(): void {
    // Clean up any event listeners if needed
    this.isDragging = false;
  }

  // Divider dragging methods
  startDragging(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startWidth = this.questionSectionWidth;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    const diff = event.clientX - this.startX;
    const newWidth = this.startWidth + diff;

    // Apply min and max constraints
    if (newWidth >= 400 && newWidth <= 1400) {
      this.questionSectionWidth = newWidth;
    }
  }

  @HostListener('document:mouseup')
  stopDragging() {
    this.isDragging = false;
  }

  private loadSubjectContent() {
    if (this.currentQuestion) {
      const content = this.subjectContents[this.currentQuestion.subject];
      if (content) {
        this.subjectContent = this.sanitizer.bypassSecurityTrustHtml(content.content);
        this.keyPoints = content.keyPoints;
      }
    }
  }

}
