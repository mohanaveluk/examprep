import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamProgressChartComponent } from './exam-progress-chart.component';

describe('ExamProgressChartComponent', () => {
  let component: ExamProgressChartComponent;
  let fixture: ComponentFixture<ExamProgressChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamProgressChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamProgressChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
