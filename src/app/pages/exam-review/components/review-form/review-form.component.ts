import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamReviewService, Review } from '../../exam-review.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent  implements OnInit {
  @Input() examId!: string;
  @Input() initialReview?: Review;
  @Input() isEdit = false;
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

  ngOnInit(): void {
    if (this.initialReview && this.isEdit) {
      this.reviewForm.patchValue({
        rating: this.initialReview.rating,
        comment: this.initialReview.comment
      });
    }
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      const reviewData = {
        examId: this.examId,
        ...this.reviewForm.value
      };

      const request = this.isEdit && this.initialReview
      ? this.reviewService.updateReview(this.initialReview.id, reviewData)
      : this.reviewService.createReview(reviewData);

      request.subscribe({
        next: () => {
          this.snackBar.open(
            `Review ${this.isEdit ? 'updated' : 'submitted'} successfully!`,
            'Close',
            { duration: 3000 }
          );
          if (!this.isEdit) {
            this.reviewForm.reset();
          }
          this.reviewSubmitted.emit();
        },
        error: (error) => {
          this.snackBar.open(
            `Failed to ${this.isEdit ? 'update' : 'submit'} review. Please try again.`,
            'Close',
            { duration: 3000 }
          );
          console.error('Error with review:', error);
        }
      });

      /*this.reviewService.createReview(review).subscribe({
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
      });*/
    }
  }
}