import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-result-details-dialog',
  templateUrl: './result-details-dialog.component.html',
  styleUrls: ['./result-details-dialog.component.scss']
})
export class ResultDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  getAnswerStatus(question: any): string {
    return question.isCorrect ? 'Correct' : 'Incorrect';
  }

  getChipColor(isCorrect: boolean): string {
    return isCorrect ? 'primary' : 'warn';
  }
}