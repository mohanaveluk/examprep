import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam, ExamSession, Question, RandomQuestionResponse } from '../../models/exam.model';
import { ExamService } from '../exam.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewListDialogComponent } from '../components/review-list-dialog/review-list-dialog.component';
import { ExamStateService, ExamTiming } from '../../../core/services/exam-state.service';
import { interval, Subscription } from 'rxjs';
import { ExamSessionService } from '../../../core/services/exam-session.service';
import { PauseExamDialogComponent } from './pause-exam-dialog.component';
import { SessionExpiredDialogComponent } from '../../../shared/components/session-expired-dialog/session-expired-dialog.component';


@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent  implements OnInit, OnDestroy {
  examId: string = '';
  currentQuestion: RandomQuestionResponse | null = null;
  currentIndex: number = 0;
  questionNumber: number = 0;
  totalQuestions: number = 0;
  selectedAnswers: { [key: number]: number | number[] } = {};
  direction: string = "";
  exam!: Exam;
  reviewList: number[] = [];
  examTiming: ExamTiming | null = null;
  remainingTime: number = 0;
  session: ExamSession | undefined;
  private timerInterval: any;
  private examTimingSubscription: Subscription | null = null;
  private timerSubscription?: Subscription;
  private sessionSubscription?: Subscription;

  public warningMessage: string = ""
  public errorMessage: string = ""
  private timeText: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private examStateService: ExamStateService,
    private examSessionService: ExamSessionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.examId = this.route.snapshot.params['id'];
    
    /*this.examTimingSubscription = this.examStateService.getExamTiming().subscribe({
      next: (timing) => {
        if (!timing) {
          this.router.navigate(['/exam/list']);
          return;
        }
        this.examTiming = timing;
        this.startTimer();
      }
    });
    //this.loadQuestion();*/
    this.loadExam(this.examId);
    this.checkExamSession();
    this.startSessionMonitoring();
  }

  private checkExamSession() {
    this.examSessionService.getProgress(this.examId).subscribe({
      next: (session: any) => {
        this.session = session.data;
        this.currentIndex = this.session?.currentIndex ?? 0;
        if (this.session?.status === 'not-started') {
          this.startNewExam();
        } else {
          this.loadQuestion();
        }
      },
      error: () => this.startNewExam()
    });
  }

  loadExam(examId: string) {
    this.examService.getExam(examId).subscribe({
      next: (response: any) => {
        if(response.success){
          this.exam = response.data;
          this.exam.categoryText = this.exam?.category?.name;
        }
        else{
          this.warningMessage = "No exam found at this moment..."
        }
      },
      error: (error) => {
        console.error('Failed to load exams:', error);
      }
    });
  }

  loadQuestion() {
    this.examService.getRandomQuestion(this.examId, this.direction).subscribe({
      next: (response: any) => {
        this.currentQuestion = response.question.data;
        if(this.session){
          this.session.totalQuestions =  this.exam.totalQuestions ?? 0;
          this.startTimer();
        }
        console.log(this.currentQuestion);
        this.remainingTime =  this.currentQuestion?.timeRemaining ?? 0;
        this.questionNumber = this.currentQuestion?.questionNumber ?? 0;
        this.totalQuestions = this.currentQuestion?.totalQuestions ?? 0;
      },
      error: (error) => {
        console.error('Failed to load question:', error);
      }
    });
  }

  private startNewExam() {
    this.examSessionService.startExam(this.examId).subscribe({
      next: (session: any) => {
        this.session = session.data;
        this.direction = "";
        this.loadQuestion(); //this.loadCurrentQuestion();
      },
      error: (error) => {
        console.error('Failed to start exam:', error);
      }
    });
  }

  private startSessionMonitoring() {
    this.sessionSubscription = interval(30000).subscribe(() => {
      if (this.session?.status === 'in-progress') {
        this.examSessionService.getProgress(this.examId).subscribe(session => {
          this.session = session;
        });
      }
    });
  }

  private loadCurrentQuestion() {
    this.examSessionService.getCurrentQuestion(this.examId).subscribe({
      next: (question) => {
        this.currentQuestion = question;
      },
      error: (error) => console.error('Failed to load question:', error)
    });
  }

  onPauseClick() {
    const dialogRef = this.dialog.open(PauseExamDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'pause') {
        this.examSessionService.pauseExam(this.examId).subscribe({
          next: (session: any) => {
            console.log(`Pause: ${session.data}`);
            this.session = session.data;
            this.clearTimer();           
            //this.router.navigate(['/exam/list']);
          },
          error: (error) => {
            console.error('Failed to pause exam:', error);
          }
        });
      }
    });
  }

  resumeExam() {
    this.examSessionService.resumeExam(this.examId).subscribe({
      next: (session: any) => {
        console.log(`Resume: ${session.data}`);
        this.session = session.data;
        this.loadQuestion();
        this.startTimer();
      },
      error: (error) => console.error('Failed to resume exam:', error)
    });
  }


  addToReview() {
    if (this.currentQuestion && !this.reviewList.includes(this.currentIndex)) {
      this.reviewList.push(this.currentIndex);
    }
  }

  openReviewList() {
    const dialogRef = this.dialog.open(ReviewListDialogComponent, {
      width: '500px',
      data: {
        questions: this.reviewList.map(index => ({
          index,
          question: this.currentQuestion?.question || '',
          answered: this.selectedAnswers[index] !== undefined
        }))
      }
    });

    dialogRef.afterClosed().subscribe(selectedIndex => {
      if (selectedIndex !== undefined) {
        this.currentIndex = selectedIndex;
        this.loadQuestion();
      }
    });
  }
  
  getSelectedAnswer(index: number): number | undefined {
    const answer = this.selectedAnswers[index];
    return Array.isArray(answer) ? undefined : answer;
  }

  getSelectedAnswerForOrdering(index: number): number[] | undefined {
    const answer = this.selectedAnswers[index];
    return Array.isArray(answer) ? answer : undefined;
  }

  onSingleAnswerChange(optionId: number) {
    this.selectedAnswers[this.currentIndex] = optionId;
  }

  onMultipleAnswerChange(optionId: number, checked: boolean) {
    const currentAnswers = (this.selectedAnswers[this.currentIndex] as number[]) || [];
    
    if (checked) {
      this.selectedAnswers[this.currentIndex] = [...currentAnswers, optionId];
    } else {
      this.selectedAnswers[this.currentIndex] = currentAnswers.filter(id => id !== optionId);
    }
  }

  onOrderingAnswerChange(orderedIds: number[]) {
    this.selectedAnswers[this.currentIndex] = orderedIds;
  }


  isOptionSelected(optionId: number): boolean {
    const answer = this.selectedAnswers[this.currentIndex];
    if (Array.isArray(answer)) {
      return answer.includes(optionId);
    }
    return answer === optionId;
  }

  hasCurrentAnswer(): boolean {
    const currentAnswer = this.selectedAnswers[this.currentIndex];
    if (Array.isArray(currentAnswer)) {
      return currentAnswer.length > 0;
    }
    return currentAnswer !== undefined;
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.direction = 'prev';
      this.loadQuestion();
    }
  }

  next() {
    if (this.currentIndex < this.totalQuestions - 1) {
      this.direction = 'next';
      this.currentIndex++;
      this.loadQuestion();
      console.log(this.selectedAnswers);
    }
  }

  submit() {
    const answersArray = Object.entries(this.selectedAnswers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId),
      answer
    }));

    this.examService.submitExam(this.examId, answersArray).subscribe({
      next: () => this.router.navigate(['/exam/summary', this.examId]),
      error: (error) => console.error('Failed to submit exam:', error)
    });
  }

  private startTimer() {

    this.timerInterval = setInterval(() => {
      if(this.timerInterval === null) return;
      const now = new Date().getTime();
      //const endTime = new Date(this.examTiming!.endTime).getTime();
      const endTime = new Date(this.session?.endTime!).getTime() || 0;
      this.remainingTime = Math.max(0, endTime - now);

      if (this.remainingTime <= 0) {
        clearInterval(this.timerInterval);
        this.submit();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.examTimingSubscription) {
      this.examTimingSubscription.unsubscribe();
    }
    this.examStateService.clearExamTiming();

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe();
    }
  }

  /*formatRemainingTime(): string {
    if (!this.session?.remainingTime) return '00:00';
    //const minutes = Math.floor(this.session.remainingTime / 60);
    //const seconds = this.session.remainingTime % 60;
    const minutes = Math.floor(this.session.remainingTime / (1000 * 60));
    const seconds = Math.floor((this.session.remainingTime % (1000 * 60)) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }*/

  formatRemainingTime(): string {
    if (this.timerInterval) {
      const minutes = Math.floor(this.remainingTime / (1000 * 60));
      const seconds = Math.floor((this.remainingTime % (1000 * 60)) / 1000);
      this.timeText =  `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return this.timeText;
  }

  setExamSession(session: any){
    const examSession: ExamSession  = {
        examId: session.examId,
        currentIndex: 0,
        questionNumber: 0,
        totalQuestions: 0,
        answeredQuestions:0,
        status: 'active',
        startTime: new Date,
        endTime: new Date,
        lastUpdated: new Date,
        remainingTime: 0
    };
    this.session = examSession;
  }
}
