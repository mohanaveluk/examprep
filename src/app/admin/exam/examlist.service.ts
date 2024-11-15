import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface AdminExam {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive';
}

@Injectable({
  providedIn: 'root'
})
export class ExamlistService {

  private mockExams: AdminExam[] = [
    {
      id: '1',
      title: 'Basic Medical Sciences',
      description: 'Test your knowledge in anatomy, physiology, and biochemistry',
      duration: 60,
      totalQuestions: 50,
      passingScore: 70,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
      status: 'active'
    },
    {
      id: '2',
      title: 'Clinical Sciences',
      description: 'Comprehensive test covering pathology, pharmacology, and medicine',
      duration: 90,
      totalQuestions: 75,
      passingScore: 75,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-20'),
      status: 'active'
    },
    {
      id: '3',
      title: 'Medical Ethics & Patient Care',
      description: 'Evaluation of medical ethics and patient care principles',
      duration: 45,
      totalQuestions: 30,
      passingScore: 80,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25'),
      status: 'inactive'
    }
  ];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  getExams(): Observable<AdminExam[]> {
    // In a real application, this would be an HTTP call
    // return this.http.get<AdminExam[]>('/api/admin/exams');
    return of(this.mockExams);
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
