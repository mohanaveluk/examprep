import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
import { ExamResultService } from '../services/exam-result.service';
import { ActivityTrackerService } from '../../../core/services/activity-tracker.service';
import { InactivityDialogComponent } from '../inactivity-dialog/inactivity-dialog.component';
import { ReviewConfirmationDialogComponent } from '../components/review-confirmation-dialog/review-confirmation-dialog.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface SubjectContent {
  [key: string]: {
    content: string;
    keyPoints: string[];
    imageUrl?: string;
  };
}

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
  questionSectionWidth = 600; // Initial width
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
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private examStateService: ExamStateService,
    private examSessionService: ExamSessionService,
    private examResultService: ExamResultService,
    private activityTracker: ActivityTrackerService,
    private sanitizer: DomSanitizer,
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
    this.startActivityTracking();

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
    
  private checkExamSession() {
    if (this.session === undefined || this.session === null) {
      this.startNewExam();
    }
    else {
      this.examSessionService.getProgress(this.session?.id!, this.examId).subscribe({
        next: (session: any) => {
          this.session = session.data;
          if (this.session) {
            //this.totalAnsweredQuestions = Object.values(session.data.answeredQuestions).length > 0 ? Object.values(session.data.answeredQuestions).filter((item: any) => item[0] !== null).length : 0;
            this.totalAnsweredQuestions = Object.values(session.data.answeredQuestions).length - this.reviewList.length;
            this.currentIndex = this.session?.currentIndex ?? 0;
          }
          if (this.session?.status === 'not-started') {
            this.startNewExam();
          } else {
            this.direction = "";
            this.loadQuestion();
          }
        },
        error: (error) => {
          console.log(error.message);
          console.log(`No active exam found for the exam: ${this.examId}. Starting new exam...`);
          this.startNewExam();
        }
      });
    }
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
    this.examService.getRandomQuestion(this.session?.id!, this.examId, this.direction).subscribe({
      next: (response: any) => {
        this.currentQuestion = response.question.data;
        if (this.session) {
          this.session.totalQuestions = this.exam.totalQuestions ?? 0;
          //this.retrieveAnswer(this.examId, this.currentQuestion?.qguid!, this.session?.id!);
          if(this.timerInterval === null && this.session.status === 'active') {
            this.startTimer();
          }
          else if(this.session.status === 'paused'){
            this.showInactivityDialog();
          }
        }
        console.log(this.currentQuestion);
        if (this.currentQuestion) {
          if(this.currentQuestion?.userAnswers.length > 0){
            this.selectedOption = this.currentQuestion?.userAnswers || [];
            this.selectedAnswers[this.currentQuestion.questionIndex] = this.currentQuestion?.userAnswers.length > 1 ? this.currentQuestion?.userAnswers.map(x => +x) : +this.currentQuestion?.userAnswers!;
          }
          this.currentIndex = this.currentQuestion?.questionIndex;
          this.remainingTime = this.currentQuestion?.timeRemaining ?? 0;
          this.questionNumber = this.currentQuestion?.questionNumber ?? 0;
          this.totalQuestions = this.currentQuestion?.totalQuestions ?? 0;
          this.reviewList = this.currentQuestion.reviewList ?? [];
      }
      },
      error: (error) => {
        if(this.session) this.session.status = "completed";
        console.error('Failed to load question:', error);
      }
    });
  }

  loadReviewQuestion(qguid: string) {
    this.examSessionService.getReviewQuestion(this.session?.id!, this.examId, qguid).subscribe({
      next: (response: any) => {
        this.currentQuestion = response.data;
        if (this.session) {
          this.session.totalQuestions = this.exam.totalQuestions ?? 0;
          //this.retrieveAnswer(this.examId, this.currentQuestion?.qguid!, this.session?.id!);
          if(this.timerInterval === null && this.session.status === 'active') {
            this.startTimer();
          }
          else if(this.session.status === 'paused'){
            this.showInactivityDialog();
          }
        }
        console.log(this.currentQuestion);
        if (this.currentQuestion) {
          if(this.currentQuestion?.userAnswers.length > 0){
            this.selectedOption = this.currentQuestion?.userAnswers || [];
            this.selectedAnswers[this.currentQuestion.questionIndex] = this.currentQuestion?.userAnswers.length > 1 ? this.currentQuestion?.userAnswers.map(x => +x) : +this.currentQuestion?.userAnswers!;
          }
          this.currentQuestion.qguid = qguid;
          this.currentIndex = this.currentQuestion?.questionIndex;
          this.remainingTime = this.currentQuestion?.timeRemaining ?? 0;
          this.questionNumber = this.currentQuestion?.questionNumber ?? 0;
          this.totalQuestions = this.currentQuestion?.totalQuestions ?? 0;
      }
      },
      error: (error) => {
        if(this.session) this.session.status = "completed";
        console.error('Failed to load question:', error);
      }
    });
  }

  private startNewExam() {
    this.examSessionService.startExam(this.examId).subscribe({
      next: (session: any) => {
        this.session = session.data;
        //this.totalAnsweredQuestions = Object.values(session.data.answeredQuestions).length > 0 ? Object.values(session.data.answeredQuestions).filter((item: any) => item[0] !== null).length : 0;
        this.totalQuestions = this.session?.questionOrder?.length || 0;
        this.reviewList = this.session?.reviewList!;
        this.totalAnsweredQuestions = Object.values(session.data.answeredQuestions).length - this.reviewList.length;
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
        this.examSessionService.getProgress(this.session?.id!, this.examId).subscribe(session => {
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

  private submitQuestionAnswer(sessionId: string, examId: string, questionGuid: string, answers: number[], atr: string) {
    this.examSessionService.submitAnswer(sessionId, examId, questionGuid, answers, atr).subscribe({
      next: (response: any) => {
        if (response?.data) {
          console.log(`answerrepo: ${JSON.stringify(response.data)}`);
          if (this.session) { this.session.answeredQuestions = response.data.answeredQuestions; }
          this.reviewList = response.data.reviewList;
          this.totalAnsweredQuestions = Object.values(response.data.answeredQuestions).length - this.reviewList.length;

          this.direction = 'next';
          this.currentIndex++;
          this.loadQuestion();
        }
      },
      error: (error) => {
        console.error(`Failed to update the question: ${error?.error}`);
        this.warningMessage = `Failed to update the question: ${error.statusText}`;
      }
    });
  }

  retrieveAnswer(sessionId: string, examId: string, qguid: string) {
    this.examSessionService.retrieveAnswer(sessionId, examId, qguid).subscribe({
      next: (response: any) => {
        const qResponse = response.data;
        if(qResponse){
          this.selectedOption = qResponse.selectedOptions;
          this.selectedAnswers[qResponse.questionIndex] = +qResponse.selectedOptions;
          console.log(this.selectedOption, qResponse);
        }
      },
      error: (error) => console.error('Failed to retrieve response:', error)
    });
  }

  onPauseClick() {
    if (this.session?.status === 'active') {
      clearInterval(this.timerInterval);
      this.handleInactivity();
    }    
  }

  onPauseClick1() {
    const dialogRef = this.dialog.open(PauseExamDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'pause') {
        this.examSessionService.pauseExam(this.session?.id!, this.examId).subscribe({
          next: (session: any) => {
            console.log(`Pause: ${session.data}`);
            this.session = session.data;
            if(this.session) this.session.totalQuestions = session.data.questionOrder.length;
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
    this.examSessionService.resumeExam(this.session?.id!, this.examId).subscribe({
      next: (session: any) => {
        console.log(`Resume: ${session.data}`);
        this.session = session.data;
        this.direction = "";
        this.loadQuestion();
        this.startTimer();
      },
      error: (error) => console.error('Failed to resume exam:', error)
    });
  }


  addToReview() {
    // if (this.currentQuestion && !this.reviewList.includes(this.currentIndex)) {
    //   this.reviewList.push(this.currentIndex);
    // }

    if (this.currentIndex < this.totalQuestions - 1) {
      const selectedoption = this.getSelectedAnswer(this.currentIndex);
      this.submitQuestionAnswer(this.session?.id!, this.examId, this.currentQuestion?.qguid!, selectedoption, "bSUw7u");
      console.log(this.selectedAnswers);
    }

  }

  openReviewList() {
    const dialogRef = this.dialog.open(ReviewListDialogComponent, {
      width: '800px',
      data: {
        // questions: this.reviewList.map(index => ({
        //   index,
        //   question: this.currentQuestion?.question || '',
        //   answered: this.selectedAnswers[index] !== undefined
        // })),
        sessionId: this.session?.id,
        examId: this.examId
      }
    });

    dialogRef.afterClosed().subscribe((selectedQuestion) => {
      if (selectedQuestion) {
        const {id, qguid} = selectedQuestion;
        this.currentIndex = this.session?.questionOrder?.indexOf(id.toString()) || 0 ;
        this.loadReviewQuestion(qguid);
      }
    });
  }
  
  getSelectedAnswer(index: number): number[] {
    const answer = this.selectedAnswers[index];
    return Array.isArray(answer) ? answer : [answer];
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
    return currentAnswer !== undefined && !isNaN(currentAnswer);
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
      const selectedoption = this.getSelectedAnswer(this.currentIndex);
      this.submitQuestionAnswer(this.session?.id!, this.examId, this.currentQuestion?.qguid!, selectedoption, "kjmGrZ");
      
      console.log(this.selectedAnswers);
    }
  }

  submit() {
    if (this.reviewList.length > 0) {
      const dialogRef = this.dialog.open(ReviewConfirmationDialogComponent, {
        width: '400px',
        data: { reviewCount: this.reviewList.length }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          // Open review list dialog
          this.openReviewList();
        } else if (result === false) {
          // Proceed with submission
          this.validateTest();
        }
      });
    } else {
      // If no questions are marked for review, proceed with submission
      this.validateTest();
    }
    
    /*
    const answersArray = Object.entries(this.selectedAnswers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId),
      answer
    }));

    this.examService.submitExam(this.examId, answersArray).subscribe({
      next: () => this.router.navigate(['/exam/summary', this.examId]),
      error: (error) => console.error('Failed to submit exam:', error)
    });*/
  }

  validateTest(){
    this.examSessionService.getResult(this.session?.id!, this.examId).subscribe({
      next: (response: any) => {
        console.log(`Result: ${response.data}`);
        this.examResultService.setResult(response.data);
        this.router.navigate([`/exam/result/${this.session?.id}/${this.examId}`]);
       },
      error: (error) => {
        console.error('Failed to resume exam:', error);
      }
    });
  }


  private startTimer() {

    this.timerInterval = setInterval(() => {
      if(this.timerInterval === null) return;
      const now = new Date().getTime();
      //const endTime = new Date(this.examTiming!.endTime).getTime();
      const endTime = new Date(this.session?.endTime!).getTime() || 0;
      this.remainingTime = Math.max(0, endTime - now);
      const remainingMinutes = Math.floor(this.remainingTime / 60)/1000;
      if (remainingMinutes <= 2) {
        this.remainingTimeMessage = `The test will automatically submit in ${this.formatRemainingTime()}`;
      }
      else{
        this.remainingTimeMessage = "";
      }

      if (this.remainingTime <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.validateTest();
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
    this.activityTracker.stopTracking();

    if (this.session?.status === 'active'){
      this.pauseExamonDestroy();
    }

    // Clean up any event listeners if needed
    this.isDragging = false;
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
    if (this.timerInterval || (!this.timerInterval && this.session?.status === 'paused')) {
      const minutes = Math.floor(this.remainingTime / (1000 * 60));
      const seconds = Math.floor((this.remainingTime % (1000 * 60)) / 1000);
      this.timeText =  `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return this.timeText;
  }

  private startActivityTracking() {
    this.activityTracker.startTracking();
    this.inactivitySubscription = this.activityTracker.inactivity$.subscribe(() => {
      if (this.session?.status === 'active') {
        clearInterval(this.timerInterval);
        this.handleInactivity();
      }
    });
  }

  private async handleInactivity() {
    //await this.examSessionService.pauseExam(this.session?.id!, this.examId).toPromise();
    this.examSessionService.pauseExam(this.session?.id!, this.examId).subscribe({
      next: (session: any) => {
        console.log(`Pause: ${session.data}`);
        this.session = session.data;
        if (this.session) this.session.totalQuestions = session.data.questionOrder.length;
      },
      error: (error) => {
        console.error('Failed to pause exam:', error);
      }
    });

    
    const dialogRef = this.dialog.open(InactivityDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'resume') {
        this.resumeExam();
      }
    });
  }

  pauseExamonDestroy() {
    this.examSessionService.pauseExam(this.session?.id!, this.examId).subscribe({
      next: (session: any) => {
        console.log(`Pause: ${session.data}`);
        this.session = session.data;
        if (this.session) this.session.totalQuestions = session.data.questionOrder.length;
      },
      error: (error) => {
        console.error('Failed to pause exam:', error);
      }
    });
  }


  showInactivityDialog(){
    const dialogRef = this.dialog.open(InactivityDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'resume') {
        this.resumeExam();
      }
    });
  }

  setExamSession(session: any){
    const examSession: ExamSession  = {
        id: session.id,
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
