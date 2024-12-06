import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../exam.service';
import { ExamResult } from '../../models/exam-result.interface';
import { Subscription } from 'rxjs';
import { ExamResultService } from '../services/exam-result.service';
import { ExamSessionService } from '../../../core/services/exam-session.service';
import { OptionResponse } from '../../models/exam.model';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent {
  result: any;
  examResult: ExamResult | null = null;
  qOptions: OptionResponse[] = []
  cops: OptionResponse[] = []
  sops: OptionResponse[] = []
  sortedCops: OptionResponse[] = []
  sortedSops: OptionResponse[] = []
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
    return isCorrect ? 'mat-mdc-chip-correct' : 'mat-mdc-chip-incorrect';
  }

  backToExams(): void {
    this.router.navigate(['/exam/list']);
  }

  retakeExam() {
    this.router.navigate(['/exam/take', ""]);
  }

  showoption(event: any){
    console.log(event);
  }

  onPanelOpened(question: any): void {
    console.log('Panel opened');
    this.examService.getQuestionOptions(question.qguid).subscribe({
      next: (response: any) => {
        console.log(`Result: ${response.data}`);
        console.log(`Result: ${question}`);
        this.qOptions = response.data;
        this.cops = this.qOptions.filter(x => question.correctOptions.includes(x?.id));
        this.sops = this.qOptions.filter(x => question.selectedOptions.includes(x?.id?.toString()));
        this.sortedCops = this.cops.sort((a, b) => question.correctOptions.indexOf(a.id) - question.correctOptions.indexOf(b.id));
        this.sortedSops = this.sops.sort((a, b) => question.selectedOptions.indexOf(a.id.toString()) - question.selectedOptions.indexOf(b.id.toString()));
        if(question.type === "ranking"){
          this.qOptions = this.sortedSops;
        }
       },
      error: (error) => {
        console.error('Failed to get exam result:', error);
      }
    });
  }

  onPanelClosed(): void {
    console.log('Panel closed');
    // Add your action here
  }

  isOptionMatched(optionId: number): boolean {
    return this.sortedSops.some(option => option.id === optionId);
  }

}
