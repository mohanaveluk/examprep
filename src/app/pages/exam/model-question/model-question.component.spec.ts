import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelQuestionComponent } from './model-question.component';

describe('ModelQuestionComponent', () => {
  let component: ModelQuestionComponent;
  let fixture: ComponentFixture<ModelQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
