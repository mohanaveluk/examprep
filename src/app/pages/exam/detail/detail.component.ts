import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../exam.service';
import { Exam, StartExam } from '../../models/exam.model';
import { ExamStateService } from '../../../core/services/exam-state.service';
import { ExamSessionService } from '../../../core/services/exam-session.service';

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
  results: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private examStateService: ExamStateService,
    private examSessionService: ExamSessionService,
  ) { }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '0';
    this.checkHistory(this.examId);
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

  loadExam(examId: string){
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

  checkHistory(examId: string){
    this.examSessionService.resultList(examId).subscribe((results: any) => {
      this.results = results.data.results;
      if(results.data.results !== null && this.results.length){
        this.router.navigate(['/exam/result-summary', this.examId]);
      }
      else{
        this.loadExam(examId);
      }
    });
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
