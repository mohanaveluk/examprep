import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialExamViewDialogComponent } from './trial-exam-view-dialog.component';

describe('TrialExamViewDialogComponent', () => {
  let component: TrialExamViewDialogComponent;
  let fixture: ComponentFixture<TrialExamViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrialExamViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrialExamViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
