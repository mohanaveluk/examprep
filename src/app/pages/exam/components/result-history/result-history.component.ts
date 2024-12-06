import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResultDetailsDialogComponent } from '../result-details-dialog/result-details-dialog.component';
import { ExamSessionService } from '../../../../core/services/exam-session.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmRetakeComponent } from '../confirm-retake/confirm-retake.component';

interface ChartData {
  name: string;
  value: number;
  color: string;
}


interface ExamResult {
  sessionId: string;
  exam: {
    id: string;
    title: string;
    description: string;
    duration: number;
    passingScore: number;
    category: {
      cguid: string;
      name: string;
      description: string;
    };
  };
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  passed: boolean;
  createdAt: string;
}

interface ResultsStats {
  total: number;
  averageScore: number;
  passedCount: number;
  failedCount: number;
}


@Component({
  selector: 'app-result-history',
  templateUrl: './result-history.component.html',
  styleUrls: ['./result-history.component.scss']
})
export class ResultHistoryComponent implements OnInit {

  examId: string = "";
  examTitle: string = "";
  results: any[] = [];
  chartData: ChartData[] = [];
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4CAF50', '#f5a066'  ] //'#F44336',
  };

  stats: ResultsStats = {
    total: 0,
    averageScore: 0,
    passedCount: 0,
    failedCount: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examSessionService: ExamSessionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.examId = this.route.snapshot.params['examId'];
    this.loadResults(this.examId);
  }

  private loadResults(examId: string) {
    this.examSessionService.resultList(examId).subscribe((results: any) => {
      this.results = results.data.results;
      results.data.results.forEach((result: any) => {
        this.examTitle = result.exam.title;
        result.chartData = this.generateChartData(result.correctAnswers, result.totalQuestions);
      });
      this.stats = {
        total: results.data.total,
        averageScore: results.data.averageScore,
        passedCount: results.data.passedCount,
        failedCount: results.data.failedCount
      };
    });
  }

  private generateChartData(correct: number, total: number): ChartData[] {
    const incorrect = total - correct;
    return [
      { name: 'Correct', value: correct, color: '#4CAF50' },
      { name: 'Incorrect', value: incorrect, color: '#F44336' }
    ];
  }

  getStatusColor(status: string): string {
    return status ? 'primary' : 'warn';
  }

  calculatePercentage(correct: number, total: number): number {
    return Math.round((correct / total) * 100);
  }

  openDetails(result: ExamResult) {
    this.dialog.open(ResultDetailsDialogComponent, {
      width: '800px',
      data: {
        sessionId: result.sessionId,
        examTitle: result.exam.title,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        scorePercentage: result.scorePercentage,
        passed: result.passed,
        createdAt: result.createdAt
      }
    });
  }

  backToExams(): void {
    this.router.navigate(['/exam/list']);
  }

  retakeExam1() {
    this.router.navigate(['/exam/take', this.examId]);
  }

  retakeExam() {
    const dialogRef = this.dialog.open(ConfirmRetakeComponent, {
      width: '400px',
      data: { examId: this.examId }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.router.navigate(['/exam/question', this.examId]);
      }
    });
  }

}