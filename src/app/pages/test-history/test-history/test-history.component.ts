import { Component, NgModule, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TestHistoryService, TestResult } from '../test-history.service';
import { TestDetailDialogComponent } from '../test-detail-dialog/test-detail-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartData, ResultsStats } from '../../models/exam.model';
import { ConfirmRetakeComponent } from '../../exam/components/confirm-retake/confirm-retake.component';

@Component({
  selector: 'app-test-history',
  templateUrl: './test-history.component.html',
  styleUrl: './test-history.component.scss'
})
export class TestHistoryComponent {
  displayedColumns: string[] = ['takenAt', 'examTitle', 'score', 'status', 'action'];
  dataSource: MatTableDataSource<TestResult>;
  examCategories: any[] = [];
  stats: ResultsStats = {
    total: 0,
    averageScore: 0,
    passedCount: 0,
    failedCount: 0
  };
  
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testHistoryService: TestHistoryService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<TestResult>([]);
  }

  ngOnInit() {
    this.loadTestHistory();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadTestHistoryStatic() {
    this.testHistoryService.getTestHistory().subscribe(results => {
      this.dataSource.data = results;
    });
    
  }

  private loadTestHistory() {
    this.testHistoryService.userExamResults().subscribe((results: any) => {
      this.examCategories = results.data.categories;
      // results.data.categories.forEach((result: any) => {
      //   result.chartData = this.generateChartData(result.correctAnswers, result.totalQuestions);
      // });
      this.stats = {
        total: results.data.total,
        averageScore: results.data.averageScore,
        passedCount: results.data.passedCount,
        failedCount: results.data.failedCount
      };
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  getStatusColor(status: string): string {
    return status === 'Pass' ? 'primary' : 'warn';
  }

  openTestDetail(result: TestResult) {
    this.dialog.open(TestDetailDialogComponent, {
      width: '1000px',
      data: result
    });
  }

  retakeExam(event: Event, result: any){
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmRetakeComponent, {
      width: '400px',
      data: { examId: result.exam.id }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.router.navigate(['/exam/question', result.exam.id]);
      }
    });
    
  }
}
