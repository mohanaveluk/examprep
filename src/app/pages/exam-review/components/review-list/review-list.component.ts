import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamReviewService, Review } from '../../exam-review.service';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  @Input() examId!: string;
  reviews: Review[] = [];

  constructor(
    private reviewService: ExamReviewService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    //this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviewsByExam(this.examId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.snackBar.open('Failed to load reviews', 'Close', {
          duration: 3000
        });
      }
    });
  }

  openReviewDialog(): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '700px',
      data: { examId: this.examId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadReviews();
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getSentimentColor(sentiment: string): string {
    switch (sentiment) {
      case 'positive': return 'primary';
      case 'negative': return 'warn';
      default: return '';
    }
  }
}