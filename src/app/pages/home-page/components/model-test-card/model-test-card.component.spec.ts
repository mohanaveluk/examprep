import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelTestCardComponent } from './model-test-card.component';

describe('ModelTestCardComponent', () => {
  let component: ModelTestCardComponent;
  let fixture: ComponentFixture<ModelTestCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelTestCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelTestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
