import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialQuestionComponent } from './trial-question.component';

describe('TrialQuestionComponent', () => {
  let component: TrialQuestionComponent;
  let fixture: ComponentFixture<TrialQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrialQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrialQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
