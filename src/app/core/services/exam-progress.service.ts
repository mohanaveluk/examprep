import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ExamProgress {
  examId: string;
  currentQuestionIndex: number;
  answers: { [key: number]: number | number[] };
  remainingTime: number;
  status: 'in-progress' | 'paused' | 'completed';
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ExamProgressService {
  private readonly STORAGE_KEY = 'exam_progress';
  private progressSubject = new BehaviorSubject<ExamProgress | null>(null);
  progress$ = this.progressSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProgressFromStorage();
  }

  private loadProgressFromStorage(): void {
    const savedProgress = localStorage.getItem(this.STORAGE_KEY);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      this.progressSubject.next(progress);
    }
  }

  saveProgress(progress: ExamProgress): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/exam/${progress.examId}/progress`, progress)
      .pipe(
        tap(() => {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
          this.progressSubject.next(progress);
        })
      );
  }

  getProgress(examId: string): Observable<ExamProgress> {
    return this.http.get<ExamProgress>(`${environment.apiUrl}/exam/${examId}/progress`);
  }

  clearProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.progressSubject.next(null);
  }

  hasActiveExam(): boolean {
    const progress = this.progressSubject.value;
    return progress !== null && progress.status !== 'completed';
  }
}