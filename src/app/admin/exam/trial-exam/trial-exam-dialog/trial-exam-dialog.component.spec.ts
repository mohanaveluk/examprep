import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialExamDialogComponent } from './trial-exam-dialog.component';

describe('TrialExamDialogComponent', () => {
  let component: TrialExamDialogComponent;
  let fixture: ComponentFixture<TrialExamDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrialExamDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrialExamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
