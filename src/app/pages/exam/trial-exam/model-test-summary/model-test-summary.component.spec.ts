import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelTestSummaryComponent } from './model-test-summary.component';

describe('ModelTestSummaryComponent', () => {
  let component: ModelTestSummaryComponent;
  let fixture: ComponentFixture<ModelTestSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelTestSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelTestSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
