import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Review } from '../../exam-review.service';

@Component({
  selector: 'app-edit-review-dialog',
  templateUrl: './edit-review-dialog.component.html',
  styleUrls: ['./edit-review-dialog.component.scss']
})
export class EditReviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { review: Review }
  ) {}

  onReviewUpdated(): void {
    this.dialogRef.close(true);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}