import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../exam.service';
import { ExamResult } from '../../models/exam-result.interface';
import { Subscription } from 'rxjs';
import { ExamResultService } from '../services/exam-result.service';
import { ExamSessionService } from '../../../core/services/exam-session.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit, OnDestroy {
  result: any;
  examResult: ExamResult | null = null;
  private resultSubscription?: Subscription;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private examResultService: ExamResultService,
    private examSessionService: ExamSessionService,
  ) {}


  ngOnInit() {
    const sessionId = this.route.snapshot.params['sessionId'];
    const examId = this.route.snapshot.params['examId'];

    this.resultSubscription = this.examResultService.getResult().subscribe(result => {
      if (!result) {
        //this.router.navigate(['/exam/list']);
        this.getExamResult(sessionId, examId);
      }
      this.examResult = result;
    });

    // this.examService.getExamResult(examId).subscribe({
    //   next: (result) => this.result = result,
    //   error: (error) => console.error('Failed to load result:', error)
    // });
  }

  getExamResult(sessionId: string, examId: string){
    this.examSessionService.getResult(sessionId, examId).subscribe({
      next: (response: any) => {
        console.log(`Result: ${response.data}`);
        this.examResult = response.data;
       },
      error: (error) => {
        console.error('Failed to get exam result:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.resultSubscription?.unsubscribe();
    this.examResultService.clearResult();
  }

  getQuestionStatusColor(isCorrect: boolean): string {
    return isCorrect ? 'primary' : 'warn';
  }

  backToExams(): void {
    this.router.navigate(['/exam/list']);
  }
}
