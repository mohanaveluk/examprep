import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDetailDialogComponent } from './test-detail-dialog.component';

describe('TestDetailDialogComponent', () => {
  let component: TestDetailDialogComponent;
  let fixture: ComponentFixture<TestDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
