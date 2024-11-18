import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamlistService } from '../examlist.service';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-exam-page',
  templateUrl: './exam-page.component.html',
  styleUrl: './exam-page.component.scss'
})
export class ExamPageComponent implements OnInit {
  public exam = {
    title: '',
    description: '',
    notes: '',
    duration: 0,
    passScore: 0
  };
  isEditMode = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private examlistService: ExamlistService,
    private headerService: HeaderService
  ) {}

  ngOnInit() {
    this.headerService.setTitle("Admin - Exam");
    this.route.queryParams.subscribe(params => {
      if (params['id'] && params['mode'] === 'edit') {
        this.isEditMode = true;
        this.loadExam(params['id']);
      }
    });
  }

  loadExam(id: string) {
    this.examlistService.getExamById(id).subscribe(exam => {
      if (exam) {
        this.exam = {
          ...exam,
          passScore: exam.passingScore
        };
      }
    });
  }
  
  onSubmit() {
    // Save exam details (you can use a service to save the data)
    console.log('Exam details:', this.exam);
    // Navigate to the question page
    this.router.navigate(['/admin/exam/question']);
  }

  // onSubmit() {
  //   const examData = {
  //     ...this.exam,
  //     passingScore: this.exam.passScore
  //   };

  //   const request = this.isEditMode ? 
  //     this.examlistService.updateExam(examData) :
  //     this.examlistService.createExam(examData);

  //   request.subscribe({
  //     next: () => {
  //       this.router.navigate(['/admin/exam/question']);
  //     },
  //     error: (error) => {
  //       console.error('Error saving exam:', error);
  //     }
  //   });
  // }
}
