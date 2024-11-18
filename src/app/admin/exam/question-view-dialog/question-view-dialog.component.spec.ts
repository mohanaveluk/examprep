import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionViewDialogComponent } from './question-view-dialog.component';

describe('QuestionViewDialogComponent', () => {
  let component: QuestionViewDialogComponent;
  let fixture: ComponentFixture<QuestionViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
