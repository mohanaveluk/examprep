import { Component, Input, OnInit } from '@angular/core';
import { ExamReviewService, Review } from '../../exam-review.service';

@Component({
  selector: 'app-review-rating',
  templateUrl: './review-rating.component.html',
  styleUrl: './review-rating.component.scss'
})
export class ReviewRatingComponent  implements OnInit {
  @Input() examId!: string;
  averageRating: number = 0;
  totalReviews: number = 0;

  constructor(private reviewService: ExamReviewService) {}

  ngOnInit(): void {
    this.loadAverageRating();
  }

  private loadAverageRating(): void {
    this.reviewService.reviewsByExam(this.examId).subscribe({
      next: (reviews: Review[]) => {
        this.totalReviews = reviews.length;
        if (this.totalReviews > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          this.averageRating = Math.round((totalRating / this.totalReviews) * 10) / 10;
        }
      },
      error: (error) => console.error('Error loading reviews:', error)
    });
  }
}
