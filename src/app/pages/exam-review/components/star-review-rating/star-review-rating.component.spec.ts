import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarReviewRatingComponent } from './star-review-rating.component';

describe('StarReviewRatingComponent', () => {
  let component: StarReviewRatingComponent;
  let fixture: ComponentFixture<StarReviewRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StarReviewRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarReviewRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
