import { Component } from '@angular/core';
import { ModelExam } from '../../../models/exam.model';
import { ModelExamService } from '../../model-exam.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-model-test-list',
  templateUrl: './model-test-list.component.html',
  styleUrl: './model-test-list.component.scss'
})
export class ModelTestListComponent {
  exams: ModelExam[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private examService: ModelExamService,
    private router: Router
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
    this.router.navigate(['/exam/trial', examId]);
  }

  getProgressColor(passingScore: number): string {
    if (passingScore >= 80) return 'primary';
    if (passingScore >= 60) return 'accent';
    return 'warn';
  }
}
