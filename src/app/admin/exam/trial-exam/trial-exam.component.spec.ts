import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialExamComponent } from './trial-exam.component';

describe('TrialExamComponent', () => {
  let component: TrialExamComponent;
  let fixture: ComponentFixture<TrialExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrialExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrialExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
