import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamCategoriesComponent } from './exam-categories.component';

describe('ExamCategoriesComponent', () => {
  let component: ExamCategoriesComponent;
  let fixture: ComponentFixture<ExamCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
