import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestResult } from '../test-history.service';
import { ChartData } from '../../models/exam.model';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-test-detail-dialog',
  templateUrl: './test-detail-dialog.component.html',
  styleUrl: './test-detail-dialog.component.scss'
})
export class TestDetailDialogComponent {
  chartData: any;
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4CAF50', '#f5a066'  ] //'#F44336',
  };
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TestDetailDialogComponent>) {
    this.chartData = this.generateChartData(data.correctAnswers, data.totalQuestions);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  getStatusColor(status: string): string {
    return status === 'passed' ? 'status-passed' : 'status-failed';
    //return status === 'Pass' ? 'primary' : 'warn';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  
  private generateChartData(correct: number, total: number): ChartData[] {
    const incorrect = total - correct;
    return [
      { name: 'Correct', value: correct, color: '#4CAF50' },
      { name: 'Incorrect', value: incorrect, color: '#F44336' }
    ];
  }
}
