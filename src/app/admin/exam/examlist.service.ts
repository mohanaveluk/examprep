import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Question } from './models/question.model';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';
import { Category } from '../../shared/models/category.model';

export interface AdminExam {
  id: string;
  title: string;
  description: string;
  notes: string;
  categoryId: string,
  categoryText?: string,
  totalQuestions: number;
  duration: number;
  passingScore: number;
  createdAt: Date;
  updatedAt?: Date;
  status: number;
  questions?: Question[];
}

@Injectable({
  providedIn: 'root'
})
export class ExamlistService {
  private apiUrl = '/api/admin/exams';
  private mockExams: AdminExam[] = [
    {
      id: '1',
      title: 'Basic Medical Sciences',
      description: 'Test your knowledge in anatomy, physiology, and biochemistry',
      duration: 60,
      notes: '',
      categoryId: '1',
      categoryText: 'Nurse',
      totalQuestions: 50,
      passingScore: 70,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
      status: 1
    },
    {
      id: '2',
      title: 'Clinical Sciences',
      description: 'Comprehensive test covering pathology, pharmacology, and medicine',
      notes: '',
      categoryId: '1',
      categoryText: 'Medicone',
      duration: 90,
      totalQuestions: 75,
      passingScore: 75,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-20'),
      status: 1
    },
    {
      id: '3',
      title: 'Medical Ethics & Patient Care',
      description: 'Evaluation of medical ethics and patient care principles',
      notes: '',
      categoryId: '1',
      categoryText: 'Vision',
      duration: 45,
      totalQuestions: 30,
      passingScore: 80,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25'),
      status: 1
    }
  ];

  /*private mockCategory: Category[] = [
    {
      id: "1",
      name: "Nurse"
    },
    {
      id: "2",
      name: "Medicine"
    },
    {
      id: "3",
      name: "Dental"
    },
    {
      id: "4",
      name: "Vision"
    }
  ];*/
  constructor(
    private http: HttpClient,
    private apiUrlBuilder: ApiUrlBuilder,
    private snackBar: MatSnackBar
  ) {}

  getCategories(): Observable<any[]> {
    const createApi = this.apiUrlBuilder.buildApiUrl('categories');
    return this.http.get<Category[]>(createApi);
    //return of(this.mockCategory);
  }

  getExams(): Observable<AdminExam[]> {
    // In a real application, this would be an HTTP call
    const createApi = this.apiUrlBuilder.buildApiUrl('u-exam');
    return this.http.get<AdminExam[]>(createApi);
    //return of(this.mockExams);
  }

  getExamById(id: string): Observable<AdminExam | undefined> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${id}`);
    return this.http.get<AdminExam>(createApi);
    //return of(this.mockExams.find(exam => exam.id === id));
  }

  createExam(exam: Partial<AdminExam>): Observable<AdminExam> {
    const createApi = this.apiUrlBuilder.buildApiUrl('u-exam');
    return this.http.post<AdminExam>(createApi, exam);
    /*
    const newExam: AdminExam = {
      id: Date.now().toString(),
      title: exam.title || '',
      description: exam.description || '',
      notes: exam.notes  || '',
      category: exam.category  || 0,
      duration: exam.duration || 0,
      totalQuestions: 0,
      passingScore: exam.passingScore || 0,
      status: 0,
      createdAt: new Date()
    };
    this.mockExams.push(newExam);
    return of(newExam);
    */
  }

  updateExam(exam: Partial<AdminExam>): Observable<AdminExam> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${exam.id}`);
    return this.http.put<AdminExam>(createApi, exam);

    /*const index = this.mockExams.findIndex(e => e.id === exam.id);
    if (index !== -1) {
      this.mockExams[index] = {
        ...this.mockExams[index],
        ...exam,
        updatedAt: new Date()
      };
      return of(this.mockExams[index]);
    }
    throw new Error('Exam not found');*/
  }

  deleteExam(id: string): Observable<boolean> {
    // In a real application, this would be an HTTP call
    // return this.http.delete<void>(`/api/admin/exams/${id}`).pipe(
    //   map(() => true),
    //   catchError(error => {
    //     this.showError('Failed to delete exam');
    //     return of(false);
    //   })
    // );
    
    const index = this.mockExams.findIndex(exam => exam.id === id);
    if (index !== -1) {
      this.mockExams.splice(index, 1);
      this.showSuccess('Exam deleted successfully');
      return of(true);
    }
    this.showError('Failed to delete exam');
    return of(false);
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

}
