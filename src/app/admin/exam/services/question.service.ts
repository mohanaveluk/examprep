import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Question, QuestionResponse } from '../models/question.model';
import { environment } from '../../../../environments/environment';
import { ApiUrlBuilder } from '../../../shared/utility/api-url-builder';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = `${environment.apiUrl}/questions`;

  constructor(
    private http: HttpClient,     
    private apiUrlBuilder: ApiUrlBuilder,
  ) {}

  getQuestions(examId: string): Observable<Question[]> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}`);
    return this.http.get<Question[]>(createApi)
      .pipe(
        catchError(this.handleError)
      );
  }

  getQuestion(qguid: string): Observable<QuestionResponse> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/question/${qguid}`);
    return this.http.get<QuestionResponse>(createApi)
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

  createQuestion(examId: string, question: Omit<Question, 'id' | 'isDeleted'>): Observable<Question> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}/questions`);
    return this.http.post<Question>(createApi, question)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateQuestion(examId: string, guid: string, question: Omit<Question, 'id' | 'isDeleted'>): Observable<Question> {
    const updateApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}/questions/${guid}`);
    return this.http.put<Question>(updateApi, question)
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
    if(error?.status === 401){
      return throwError(() => new Error('Your session has expired. Please login back.'));  
    }
    else if(error?.status === 408){
      return throwError(() => new Error('Connection timed out. Please check your network connection and database server status.'));  
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
