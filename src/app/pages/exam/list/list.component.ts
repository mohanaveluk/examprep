import { Component } from '@angular/core';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  public exams: any[] = [];

  constructor(private examService: ExamService) {}

  ngOnInit1() {
    this.examService.getExams().subscribe(data => {
      this.exams = data;
    });
  }

  ngOnInit() {
    this.examService.getAvailableExams().subscribe({
      next: (exams) => this.exams = exams,
      error: (error) => console.error('Failed to load exams:', error)
    });
  }


}
