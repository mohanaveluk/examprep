import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';
import { ExamSession } from '../../pages/models/exam.model';



@Injectable({
  providedIn: 'root'
})
export class ExamSessionService {
  private sessionSubject = new BehaviorSubject<ExamSession | null>(null);
  session$ = this.sessionSubject.asObservable();

  constructor(private http: HttpClient, private apiUrlBuilder: ApiUrlBuilder) {}

  startExam(examId: string): Observable<ExamSession> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}/start`);
    return this.http.post<ExamSession>(createApi, {})
      .pipe(
        tap(session => this.sessionSubject.next(session))
      );
  }

  pauseExam(examId: string): Observable<ExamSession> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}/pause`);
    return this.http.put<ExamSession>(createApi, {})
      .pipe(
        tap(session => this.sessionSubject.next(session))
      );
  }

  resumeExam(examId: string): Observable<ExamSession> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}/resume`);
    return this.http.put<ExamSession>(createApi, {})
      .pipe(
        tap(session => this.sessionSubject.next(session))
      );
  }

  getProgress(examId: string): Observable<ExamSession> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}/progress`);
    return this.http.get<ExamSession>(createApi)
      .pipe(
        tap(session => this.sessionSubject.next(session))
      );
  }

  getCurrentQuestion(examId: string, ): Observable<any> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}/examQuestion`);
    return this.http.get(createApi);
  }

  hasActiveSession(): boolean {
    const session = this.sessionSubject.value;
    return session !== null && ['in-progress', 'paused'].includes(session.status);
  }

  clearSession(): void {
    this.sessionSubject.next(null);
  }
}