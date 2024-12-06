import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Exam, ExamSession } from '../../../models/exam.model';

@Component({
  selector: 'app-exam-progress-chart',
  templateUrl: './exam-progress-chart.component.html',
  styleUrl: './exam-progress-chart.component.scss'
})
export class ExamProgressChartComponent implements OnChanges {
  @Input() session: ExamSession | null = null;
  @Input() exam: Exam | null = null;

  chartData: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['session'] && this.session) {
      this.updateChartData();
    }
  }

  private updateChartData() {
    if (!this.session) return;

    const remaining = this.session ? this.session.questionOrder!.length - (Object.values(this.session.answeredQuestions).length + this.session.reviewList!.length) : 0;
    
    this.chartData = [
      {
        name: 'Answered',
        value: (Object.values(this.session.answeredQuestions).length + this.session.reviewList!.length)
      },
      {
        name: 'Remaining',
        value: remaining
      }
    ];
  }
}