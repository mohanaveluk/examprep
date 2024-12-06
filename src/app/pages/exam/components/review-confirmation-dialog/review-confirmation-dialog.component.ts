import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-review-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Review Questions</h2>
    <mat-dialog-content>
      <p>You have {{ data.reviewCount }} question(s) marked for review. Would you like to review them before submitting?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">No, Submit</button>
      <button mat-raised-button color="primary" (click)="onYesClick()">Yes, Review</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 300px;
    }
    mat-dialog-actions {
      margin-top: 16px;
    }
  `]
})
export class ReviewConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ReviewConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reviewCount: number }
  ) {}

  onYesClick(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}