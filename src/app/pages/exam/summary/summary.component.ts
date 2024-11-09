import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  result: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit() {
    const examId = this.route.snapshot.params['id'];
    this.examService.getExamResult(examId).subscribe({
      next: (result) => this.result = result,
      error: (error) => console.error('Failed to load result:', error)
    });
  }

  backToExams() {
    this.router.navigate(['/exam/list']);
  }
}
