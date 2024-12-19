import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Question, QuestionResult } from '../models/exam.model';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';

@Injectable({
  providedIn: 'root'
})
export class ModelQuestionService {
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

  constructor(private http: HttpClient, private apiUrlBuilder: ApiUrlBuilder) {}

  getQuestion1(examId: string, index: number): Observable<{ question: Question, totalQuestions: number }> {
    // In a real app, this would be an API call
    return of({
      question: this.mockQuestions[index % this.mockQuestions.length],
      totalQuestions: this.mockQuestions.length
    });
  }

  submitAnswer1(questionId: number, selectedAnswers: number[]): Observable<QuestionResult> {
    // In a real app, this would be an API call
    const correctAnswers = this.correctAnswers[questionId];
    const isCorrect = this.arraysEqual(selectedAnswers.sort(), correctAnswers.sort());

    return of({
      isCorrect,
      correctAnswers,
      explanation: this.explanations[questionId]
    });
  }

  getQuestion(examId: string, index: number): Observable<{ question: Question, totalQuestions: number }> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`te_questions/exam/${examId}?index=${index}`);
    return this.http.get<{ question: Question, totalQuestions: number }>(createApi);
  }

  submitAnswer(examId: string, questionId: number, selectedAnswers: number[]): Observable<QuestionResult> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`te_questions/${questionId}/${examId}/validate`);
    return this.http.post<QuestionResult>(createApi, { selectedAnswers });
  }

  private arraysEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }
}