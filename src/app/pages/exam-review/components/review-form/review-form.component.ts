import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamReviewService } from '../../exam-review.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent {
  @Input() examId!: string;
  @Output() reviewSubmitted = new EventEmitter<void>();

  reviewForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reviewService: ExamReviewService,
    private snackBar: MatSnackBar
  ) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      const review = {
        examId: this.examId,
        ...this.reviewForm.value
      };

      this.reviewService.createReview(review).subscribe({
        next: () => {
          this.snackBar.open('Review submitted successfully!', 'Close', {
            duration: 3000
          });
          this.reviewForm.reset();
          this.reviewSubmitted.emit();
        },
        error: (error) => {
          this.snackBar.open('Failed to submit review. Please try again.', 'Close', {
            duration: 3000
          });
          console.error('Error submitting review:', error);
        }
      });
    }
  }
}