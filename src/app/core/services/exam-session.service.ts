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

  pauseExam(sessionId: string, examId: string): Observable<ExamSession> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${sessionId}/${examId}/pause`);
    return this.http.put<ExamSession>(createApi, {})
      .pipe(
        tap(session => this.sessionSubject.next(session))
      );
  }

  resumeExam(sessionId: string, examId: string): Observable<ExamSession> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${sessionId}/${examId}/resume`);
    return this.http.put<ExamSession>(createApi, {})
      .pipe(
        tap(session => this.sessionSubject.next(session))
      );
  }

  submitAnswer(sessionId: string, examId: string, questionGuid: string, answers: number[], atr: string): Observable<ExamSession> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${sessionId}/${examId}/question/${questionGuid}/${atr}/submit`);
    return this.http.post<ExamSession>(createApi, {selectedAnswers: answers})
      .pipe(
        tap(session => this.sessionSubject.next(session))
      );
  }

  retrieveAnswer(sessionId: string, examId: string, questionGuid: string): Observable<any> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}/session/${sessionId}/question/${questionGuid}/answer`);
    return this.http.get<any>(createApi)
      .pipe(
        tap(session => this.sessionSubject.next(session))
      );
  }

  getProgress(sessionId: string, examId: string): Observable<ExamSession> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${sessionId}/${examId}/progress`);
    return this.http.get<ExamSession>(createApi)
      .pipe(
        tap(session => this.sessionSubject.next(session))
      );
  }

  addToReview(sessionId: string, examId: string, questionId: string): Observable<ExamSession> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${sessionId}/${examId}/review/${questionId}`);
    return this.http.post<ExamSession>(createApi, {})
      .pipe(
        tap(session => this.sessionSubject.next(session))
      );
  }

  removeFromReview(sessionId: string, examId: string, questionId: string): Observable<ExamSession> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${sessionId}/${examId}/review/${questionId}`);
    return this.http.delete<ExamSession>(createApi)
      .pipe(
        tap(session => this.sessionSubject.next(session))
      );
  }

  getReviewList(sessionId: string, examId: string): Observable<any[]> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${sessionId}/${examId}/review`);
    return this.http.get<any[]>(createApi);
  }

  getReviewQuestion(sessionId: string, examId: string, questionGuid: string): Observable<any> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${sessionId}/${examId}/review/${questionGuid}`);
    return this.http.get<any>(createApi);
  }


  getResult(sessionId: string, examId: string): Observable<ExamSession> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}/session/${sessionId}/results`);
    return this.http.get<ExamSession>(createApi)
      .pipe(
        tap(session => this.sessionSubject.next(session))
      );
  }

  getCurrentQuestion(examId: string): Observable<any> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}/examQuestion`);
    return this.http.get(createApi);
  }

  resultList(examId: string): Observable<any[]> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}/results`);
    return this.http.get<any[]>(createApi);
  }



  hasActiveSession(): boolean {
    const session = this.sessionSubject.value;
    return session !== null && ['in-progress', 'paused'].includes(session.status);
  }

  clearSession(): void {
    this.sessionSubject.next(null);
  }
}