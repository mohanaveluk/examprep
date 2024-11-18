import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Question } from '../examlist/models/question.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = `${environment.apiUrl}/questions`;

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getQuestionById(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createQuestion(question: Omit<Question, 'id' | 'isDeleted'>): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateQuestion(id: number, question: Omit<Question, 'id' | 'isDeleted'>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}`, question)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
