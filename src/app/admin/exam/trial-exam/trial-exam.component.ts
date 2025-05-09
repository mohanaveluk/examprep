import { Component, OnInit } from '@angular/core';
import { ExamService } from '../exam.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrialExamDialogComponent } from './trial-exam-dialog/trial-exam-dialog.component';
import { TrialQuestionComponent } from './trial-question/trial-question.component';
import { ModelExamService } from '../services/trial-exam.service';
import { HeaderService } from '../../services/header.service';
import { TrialExamViewDialogComponent } from './trial-exam-view-dialog/trial-exam-view-dialog.component';

@Component({
  selector: 'app-trial-exam',
  templateUrl: './trial-exam.component.html',
  styleUrl: './trial-exam.component.scss'
})
export class TrialExamComponent implements OnInit {
  exams: any[] = [];
  displayedColumns: string[] = ['number', 'title', 'description', 'totalQuestions', 'passingScore', 'actions'];
  hoveredRow: any = null;
  loading = false;
  loadingMessage = "Loading...";

  constructor(
    private examService: ExamService,
    private modelExamService: ModelExamService,
    private headerService: HeaderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle("Admin - Trial Exam");
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    this.modelExamService.getAvailableExams().subscribe({
      next: (exams:any) => {
        this.exams = exams.data;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading exams:', error);
        this.snackBar.open('Failed to load exams', 'Close', { duration: 3000 });
      }
    });
  }

  openAddEditExam(exam?: any): void {
    const dialogRef = this.dialog.open(TrialExamDialogComponent, {
      width: '800px',
      data: exam || {},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadExams();
      }
    });
  }

  onRowClick(event: MouseEvent, row: any) {
    const target = event.target as HTMLElement;
    if (!target.closest('.mat-mdc-cell:last-child')) {
      this.dialog.open(TrialExamViewDialogComponent, {
        width: '900px',
        data: row
      });
    }
  }

  deleteExam(exam: any): void {
    if (confirm(`Are you sure you want to delete "${exam.title}"?`)) {
      this.loading = true;
      this.modelExamService.deleteExam(exam.id).subscribe(success => {
        if (success) {
          this.loadExams();
        }
        this.loading = false;
      });
    }
  }

  openQuestionDashboard(examId: string): void {
    this.dialog.open(TrialQuestionComponent, {
      width: '90vw',
      height: '90vh',
      data: { examId },
      disableClose: true
    });
  }
}
