import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelTestDetailDialogComponent } from './model-test-detail-dialog.component';

describe('ModelTestDetailDialogComponent', () => {
  let component: ModelTestDetailDialogComponent;
  let fixture: ComponentFixture<ModelTestDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModelTestDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelTestDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
