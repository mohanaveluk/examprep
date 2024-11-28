import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminExam, Category, ExamlistService } from '../examlist.service';
import { HeaderService } from '../../services/header.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamService } from '../exam.service';
import { ExamQuestion } from '../models/exam.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-exam-page',
  templateUrl: './exam-page.component.html',
  styleUrl: './exam-page.component.scss'
})
export class ExamPageComponent implements OnInit {
  examForm: FormGroup;
  public exam = {
    title: '',
    description: '',
    notes: '',
    categoryId: '0',
    duration: 0,
    passScore: 0,
    
  };
  isEditMode = false;
  categories: Category[] = [];
  questions: ExamQuestion[] = [];
  isLoading = false;
  selectedFileName = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private examlistService: ExamlistService,
    private examService: ExamService,
    private headerService: HeaderService,
    private snackBar: MatSnackBar
  ) {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      notes: [''],
      category: [null, Validators.required],
      duration: [0, Validators.required],
      passScore: [0, Validators.required],
      file: [null]
    });
  }

  ngOnInit() {
    this.headerService.setTitle("Admin - Exam");
    this.route.queryParams.subscribe(params => {
      if (params['id'] && params['mode'] === 'edit') {
        this.isEditMode = true;
        this.loadExam(params['id']);
      }
    });
    this.loadCategory();
  }

  loadCategory(){
    this.examlistService.getCategories().subscribe((categoryList: any) => {
      this.categories = categoryList.data;
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
    console.log(this.examForm.get('category')?.value);
    if (this.examForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    if (this.examForm.valid && this.questions.length > 0) {
      const examData: AdminExam = {
        id: '',
        title: this.examForm.get('title')?.value,
        description: this.examForm.get('description')?.value,
        categoryId: this.examForm.get('category')?.value,
        notes: this.examForm.get('notes')?.value,
        createdAt: new Date(),
        duration: this.examForm.get('duration')?.value,
        passingScore: this.examForm.get('passScore')?.value,
        totalQuestions: 0,
        status: 1,
        questions: this.questions.map(item => {
          return {
            id: 0,
            question: item.question,
            type: item.type,
            options: item.options,
            correctAnswers: item.correctAnswers.map(ca => +ca),
            isDeleted: false,
            order: item.order || []
          }
        })
      };

      this.isLoading = true;
      const request = this.isEditMode ?
        this.examlistService.updateExam(examData) :
        this.examlistService.createExam(examData);

      request.subscribe({
        next: (response: any) => {
          this.snackBar.open('Exam data uploaded successfully', 'Close', { duration: 3000 });
          if(response.success){
            this.snackBar.open('Exam created successfully', 'Close', { duration: 3000 });
            const examId = response?.data.id;
            this.router.navigate([`/admin/exam/question/${examId}`]);
            this.resetForm();
          }
          else{
            this.snackBar.open('Failed to create exam', 'Close', { duration: 3000 });
          }
          // Navigate to the question page
        },
        error: (error) => {
          this.snackBar.open(`Error saving exam: ${error}`, 'Close', { duration: 3000 });
          this.isLoading = false;
          console.error('Error saving exam:', error);
        }
      });
    }
   
  }

  private markAllAsTouched() {
    Object.keys(this.examForm.controls).forEach(field => {
      const control = this.examForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  selectCategory(eventValue: string){
    console.log(eventValue);
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


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.processFile(file);
    }
  }

  async processFile(file: File): Promise<void> {
    this.isLoading = true;
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      this.questions = fileExt === 'csv'
        ? await this.examService.processCsvFile(file)
        : await this.examService.processExcelFile(file);
      
      this.snackBar.open('File processed successfully', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Error processing file', 'Close', { duration: 3000 });
      console.error('Error processing file:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private resetForm(): void {
    this.examForm.reset();
    this.questions = [];
    this.selectedFileName = '';
  }
}
