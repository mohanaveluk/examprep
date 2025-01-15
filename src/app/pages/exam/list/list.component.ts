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
  public filteredExams: any[] = [];
  public searchKeyword: string = "";
  public warningMessage: string = ""
  public errorMessage: string = ""
  loading = true;
  error: string | null = null;

  constructor(private examService: ExamService, private alertService: AlertService) {}

  ngOnInit1() {
    this.examService.getExams().subscribe(data => {
      this.exams = data;
    });
  }

  ngOnInit() {
    this.loadExams();
  }

  loadExams(): void {
    this.warningMessage = "";
    this.loading = true;
    this.examService.getAvailableExams().subscribe({
      next: (exams: any) => {
        this.loading = false;
        if(exams.success){
          this.exams = exams.data,
          this.filteredExams = exams.data,
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
        this.error = 'Failed to load exams. Please try again later.';
        this.loading = false;
        console.error('Failed to load exams:', error);
      }
    });
  }

  applyFilter(event: Event) {
    this.searchKeyword = (event.target as HTMLInputElement).value.toLowerCase();
    
    this.filteredExams = this.exams.filter(exam => {
      return Object.keys(exam).some(key => {
        const value = exam[key];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(this.searchKeyword);
        }
        if (typeof value === 'number') {
          return value.toString().includes(this.searchKeyword);
        }
        return false;
      });
    });
  }

  getProgressColor(passingScore: number): string {
    if (passingScore >= 80) return 'primary';
    if (passingScore >= 60) return 'accent';
    return 'warn';
  }
}
