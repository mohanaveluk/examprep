import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ReviewQuestion {
  index: number;
  question: string;
  answered: boolean;
}

interface DialogData {
  questions: ReviewQuestion[];
}

@Component({
  selector: 'app-review-list-dialog',
  templateUrl: './review-list-dialog.component.html',
  styleUrls: ['./review-list-dialog.component.css']
})
export class ReviewListDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ReviewListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  goToQuestion(index: number) {
    this.dialogRef.close(index);
  }
}