import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hoveredRating: number | null = null;

  onStarClick(rating: number): void {
    if (!this.readonly) {
      this.rating = rating;
      this.ratingChange.emit(rating);
    }
  }

  onStarHover(rating: number): void {
    if (!this.readonly) {
      this.hoveredRating = rating;
    }
  }

  onStarLeave(): void {
    this.hoveredRating = null;
  }

  getStarClass(star: number): string {
    const rating = this.hoveredRating !== null ? this.hoveredRating : this.rating;
    if (star <= rating) {
      return 'filled';
    }
    return 'empty';
  }
}