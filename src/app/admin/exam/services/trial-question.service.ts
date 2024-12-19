import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Question } from '../../../pages/models/exam.model';
import { ApiUrlBuilder } from '../../../shared/utility/api-url-builder';
import { CommonService } from '../../../shared/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class TrialQuestionService {
  private apiUrl = 'http://localhost:3000';

  private mockQuestions: Question[] = [
    {
      id: 1,
      text: 'Which of the following are symptoms of hypertension?',
      type: 'multiple',
      maxSelections: 3,
      options: [
        { id: 1, text: 'Headache' },
        { id: 2, text: 'Dizziness' },
        { id: 3, text: 'Nosebleeds' },
        { id: 4, text: 'Rash' }
      ]
    },
    {
      id: 2,
      text: 'The normal resting heart rate for adults is:',
      type: 'single',
      options: [
        { id: 1, text: '40-50 beats per minute' },
        { id: 2, text: '60-100 beats per minute' },
        { id: 3, text: '100-120 beats per minute' },
        { id: 4, text: '120-140 beats per minute' }
      ]
    },
    {
      id: 3,
      text: 'Antibiotics are effective against viral infections.',
      type: 'true-false',
      options: [
        { id: 1, text: 'True' },
        { id: 2, text: 'False' }
      ]
    }
  ];

  private correctAnswers: { [key: number]: number[] } = {
    1: [1, 2, 3],
    2: [2],
    3: [2]
  };

  private explanations: { [key: number]: string } = {
    1: 'Headache, dizziness, and nosebleeds are common symptoms of hypertension. Rash is not typically associated with high blood pressure.',
    2: 'The normal resting heart rate for adults ranges from 60-100 beats per minute. Athletes might have lower rates due to better cardiovascular fitness.',
    3: 'Antibiotics are only effective against bacterial infections, not viral infections. Using antibiotics for viral infections contributes to antibiotic resistance.'
  };

  constructor(
    private http: HttpClient, 
    private apiUrlBuilder: ApiUrlBuilder, 
    private commonService: CommonService) {}

  getQuestionsByExamId1(examId: string): Observable<Question[]> {
    return of(this.mockQuestions);
  }

  getQuestion1(examId: string, index: number): Observable<{ question: Question, totalQuestions: number }> {
    // In a real app, this would be an API call
    return of({
      question: this.mockQuestions[index % this.mockQuestions.length],
      totalQuestions: this.mockQuestions.length
    });
  }

  getQuestionsByExamId(examId: string): Observable<{ question: Question[] }> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`te_questions/exam/${examId}/all`);
    return this.http.get<{ question: Question[] }>(createApi);
  }

  getQuestionByExamId1(examId: string, index: number): Observable<{ question: Question, totalQuestions: number }> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`te_questions/exam/${examId}?index=${index}`);
    return this.http.get<{ question: Question, totalQuestions: number }>(createApi);
  }

  getQuestionByExamId(examId: string, questionId: number): Observable<{ question: Question }> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`te_questions/exam/${examId}/question/${questionId}`);
    return this.http.get<{ question: Question, totalQuestions: number }>(createApi);
  }

  createQuestion(questionData: any): Observable<any>{
    const createApi = this.apiUrlBuilder.buildApiUrl(`te_questions`);
    return this.http.post<any>(createApi, questionData);
  }

  updateQuestion(id: number, questionData: any): Observable<any>{
    const createApi = this.apiUrlBuilder.buildApiUrl(`te_questions/${id}`);
    return this.http.put<any>(createApi, questionData);
  }

  deleteQuestion(examId: string, questionId: string): Observable<boolean> {
    const updateApi = this.apiUrlBuilder.buildApiUrl(`te_questions/${examId}/${questionId}`);
    return this.http.delete<boolean>(updateApi)
      .pipe(
        catchError(error => this.commonService.handleError(error))
      );
  }
  
  private arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }
}