import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamReviewService, Review } from '../../exam-review.service';

@Component({
  selector: 'app-reply-dialog',
  templateUrl: './reply-dialog.component.html',
  styleUrls: ['./reply-dialog.component.scss']
})
export class ReplyDialogComponent {
  replyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reviewService: ExamReviewService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ReplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { review: Review }
  ) {
    this.replyForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.replyForm.valid) {
      const reply = {
        reviewId: this.data.review.id,
        comment: this.replyForm.value.comment
      };

      this.reviewService.addReply(reply).subscribe({
        next: () => {
          this.snackBar.open('Reply submitted successfully!', 'Close', {
            duration: 3000
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.snackBar.open('Failed to submit reply. Please try again.', 'Close', {
            duration: 3000
          });
          console.error('Error submitting reply:', error);
        }
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}