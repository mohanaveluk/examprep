import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialQuestionDialogComponent } from './trial-question-dialog.component';

describe('TrialQuestionDialogComponent', () => {
  let component: TrialQuestionDialogComponent;
  let fixture: ComponentFixture<TrialQuestionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrialQuestionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrialQuestionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
