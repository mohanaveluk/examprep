import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelQuestionV2Component } from './model-question-v2.component';

describe('ModelQuestionV2Component', () => {
  let component: ModelQuestionV2Component;
  let fixture: ComponentFixture<ModelQuestionV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelQuestionV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelQuestionV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
