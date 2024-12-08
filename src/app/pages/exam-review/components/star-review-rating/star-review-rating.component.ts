import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-review-rating',
  templateUrl: './star-review-rating.component.html',
  styleUrl: './star-review-rating.component.scss'
})
export class StarReviewRatingComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;

  get fullStars(): number[] {
    return Array(Math.floor(this.rating)).fill(0);
  }

  get hasHalfStar(): boolean {
    return this.rating % 1 >= 0.4;
    //return this.rating % 1 >= 0.3 && this.rating % 1 < 0.8;
  }

  get emptyStars(): number[] {
    //return Array(5 - Math.ceil(this.rating)).fill(0);
    const totalStars = 5;
    const fullStarsCount = Math.floor(this.rating);
    const halfStarCount = this.hasHalfStar ? 1 : 0;
    return Array(totalStars - fullStarsCount - halfStarCount).fill(0);
  }
}
