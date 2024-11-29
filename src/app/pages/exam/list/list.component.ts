import { Component } from '@angular/core';
import { ExamService } from '../exam.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  public exams: any[] = [];
  public warningMessage: string = ""
  public errorMessage: string = ""

  constructor(private examService: ExamService, private alertService: AlertService) {}

  ngOnInit1() {
    this.examService.getExams().subscribe(data => {
      this.exams = data;
    });
  }

  ngOnInit() {
    this.warningMessage = "";
    this.examService.getAvailableExams().subscribe({
      next: (exams: any) => {
        if(exams.success){
          this.exams = exams.data,
          this.exams.forEach((item: { categoryText: any; category: { name: any; }; }) => {
            item.categoryText = item.category.name;
          });
          this.alertService.success("Success, You are done");
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
