import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExamSessionService } from '../../../../core/services/exam-session.service';
import { ExamResult } from '../../../models/exam-result.interface';
import { OptionResponse } from '../../../models/exam.model';
import { ExamService } from '../../exam.service';

@Component({
  selector: 'app-result-details-dialog',
  templateUrl: './result-details-dialog.component.html',
  styleUrls: ['./result-details-dialog.component.scss']
})
export class ResultDetailsDialogComponent {
  examResult: ExamResult | null = null;
  qOptions: OptionResponse[] = []
  cops: OptionResponse[] = []
  sops: OptionResponse[] = []
  sortedCops: OptionResponse[] = []
  sortedSops: OptionResponse[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private examService: ExamService,
    private examSessionService: ExamSessionService,
  ) {}

  ngOnInit() {
    this.getExamResult(this.data?.sessionId, this.data?.examId);
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

  isOptionMatched(optionId: number): boolean {
    return this.sortedSops.some(option => option.id === optionId);
  }

  isCorrectAnswerMatched(optionId: number): boolean {
    return this.sortedCops.some(option => option.id === optionId);
  }

  correctAnswerOrder(optionId: number): number {
    const sortedOption = [...this.qOptions].sort((a, b) => a.id - b.id);
    const correctOrderId = this.sortedCops.findIndex(item => item.id === optionId);
    if(correctOrderId != null && correctOrderId >= 0){
      return correctOrderId+1;
    }
    return 0;
  }

  getAnswerStatus(question: any): string {
    return question.isCorrect ? 'Correct' : 'Incorrect';
  }

  getChipColor(isCorrect: boolean): string {
    return isCorrect ? 'primary' : 'warn';
  }

  getQuestionStatusColor(isCorrect: boolean): string {
    return isCorrect ? 'mat-mdc-chip-correct' : 'mat-mdc-chip-incorrect';
  }

}