import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../exam.service';
import { Exam, StartExam } from '../../models/exam.model';
import { ExamStateService } from '../../../core/services/exam-state.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  exam!: Exam;
  public warningMessage: string = ""
  public errorMessage: string = ""
  examId: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private examStateService: ExamStateService
  ) { }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '0';
    this.examService.getExam(this.examId).subscribe({
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

  startExam(){
    console.log(this.examId);
    this.router.navigate(['/exam/question', this.examId]);
    
    /*this.examService.startNewExam(this.examId).subscribe( {
      next: (response) => {
        if(response.success){
          const  startExam = response.data;
          this.startTestState(this.examId, startExam!);
          console.log(startExam);
        }
      },
      error: (error) => {
        this.errorMessage = error?.error?.message;
        console.error('Login failed:', error);
      }
    });*/

  }

  startTestState(examId: string, startExam: StartExam) {

    this.examStateService.setExamTiming({
      startTime: startExam.startTime,
      endTime: startExam.endTime,
      duration: startExam.duration,
      examId
    });

    this.router.navigate(['/exam/question', examId]);
  }

}
