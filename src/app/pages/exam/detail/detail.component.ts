import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../exam.service';
import { Exam } from '../../models/exam.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  exam!: Exam;
  public warningMessage: string = ""
  public errorMessage: string = ""
  
  constructor(private route: ActivatedRoute, private examService: ExamService) {}

  ngOnInit() {
    const examId = this.route.snapshot.paramMap.get('id') || '0';
    this.examService.getExam(examId).subscribe({
      next: (response: any) => {
        if(response.success){
          this.exam = response.data;
          this.exam.categoryText = this.exam.category?.name;
          
        }
        else{
          this.warningMessage = "No exam found at this moment..."
        }
      },
      error: (error) => {
        console.error('Failed to load exams:', error);
      }
    });
  }
}
