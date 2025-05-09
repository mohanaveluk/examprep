import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRatingComponent } from './review-rating.component';

describe('ReviewRatingComponent', () => {
  let component: ReviewRatingComponent;
  let fixture: ComponentFixture<ReviewRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
