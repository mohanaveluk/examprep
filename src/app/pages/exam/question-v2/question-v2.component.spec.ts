import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionV2Component } from './question-v2.component';

describe('QuestionV2Component', () => {
  let component: QuestionV2Component;
  let fixture: ComponentFixture<QuestionV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
