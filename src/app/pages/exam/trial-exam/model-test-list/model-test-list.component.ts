import { Component, Inject } from '@angular/core';
import { Exam, ModelExam } from '../../../models/exam.model';
import { ModelExamService } from '../../model-exam.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModelTestDetailDialogComponent } from './model-test-detail-dialog/model-test-detail-dialog.component';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-model-test-list',
  templateUrl: './model-test-list.component.html',
  styleUrl: './model-test-list.component.scss'
})
export class ModelTestListComponent {
  exams: ModelExam[] = [];
  loading = true;
  error: string | null = null;
  private readonly NEW_EXAM_DAYS = 15;

  constructor(
    private examService: ModelExamService,
    private router: Router,
    private dialog: MatDialog,
    //private viewportScroller: ViewportScroller
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    this.examService.getExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load exams. Please try again later.';
        this.loading = false;
        console.error('Error loading exams:', error);
      }
    });
  }

  selectExam(examId: string): void {
    // First scroll to top
    //this.viewportScroller.scrollToPosition([0, 0]);
    this.document.defaultView?.scrollTo(0, 0);
    // Then navigate to the exam
    this.router.navigate(['/exam/trial', examId]);
  }

  viewExamDetails(exam: ModelExam): void {
    this.dialog.open(ModelTestDetailDialogComponent, {
      width: '800px',
      data: exam,
      panelClass: 'exam-detail-dialog'
    });
  }


  getProgressColor(passingScore: number): string {
    if (passingScore >= 80) return 'primary';
    if (passingScore >= 60) return 'accent';
    return 'warn';
  }

  isNewExam(exam: ModelExam): boolean {
    const examDate = new Date(exam.createdAt);
    const daysDiff = Math.floor((Date.now() - examDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= this.NEW_EXAM_DAYS;
  }
}
