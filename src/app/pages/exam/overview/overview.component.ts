import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamSessionService } from '../../../core/services/exam-session.service';
import { ExamStateService } from '../../../core/services/exam-state.service';
import { Exam, StartExam } from '../../models/exam.model';
import { ExamService } from '../exam.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  exam!: Exam;
  public warningMessage: string = ""
  public errorMessage: string = ""
  examId: string = "";
  historyResults: any[] = [];
  isHistoryExist: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private examStateService: ExamStateService,
    private examSessionService: ExamSessionService,
  ) { }

  ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || '0';
    this.loadExam(this.examId);
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
      this.historyResults = results.data.results;
      this.isHistoryExist = (this.historyResults !== null && this.historyResults.length > 0)
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

  examHistory(){
    if(this.historyResults !== null && this.historyResults.length > 0){
      this.router.navigate(['/exam/result-summary', this.examId]);
    }
  }

  backToExams(): void {
    this.router.navigate(['/exam/list']);
  }
}
