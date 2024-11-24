import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Question } from '../models/question.model';

@Component({
  selector: 'app-question-view-dialog',
  templateUrl: './question-view-dialog.component.html',
  styleUrl: './question-view-dialog.component.scss',
})
export class QuestionViewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<QuestionViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Question
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
