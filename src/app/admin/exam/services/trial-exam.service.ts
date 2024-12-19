import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { CreateExamDto, UpdateExamDto } from '../models/exam.model';
import { ModelExam } from '../models/model-exam.interface';
import { ApiUrlBuilder } from '../../../shared/utility/api-url-builder';
import { CommonService } from '../../../shared/services/common.service';

interface QuestionTemplate {
  text: string;
  type: 'single' | 'multiple' | 'true-false';
  subject: string;
  explanation: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ModelExamService {
  private apiUrl = 'http://localhost:3000';


  constructor(
    private http: HttpClient, 
    private apiUrlBuilder: ApiUrlBuilder, 
    private commonService: CommonService) {}

  createExam(examData: CreateExamDto, questions: QuestionTemplate[]): Observable<ModelExam> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`te_exam`);
    return this.http.post<ModelExam>(createApi, examData);
  }

  updateExam(id: string, examData: UpdateExamDto, questions: QuestionTemplate[]): Observable<ModelExam> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`te_exam/${id}`);
    return this.http.put<ModelExam>(createApi, examData);
  }

  getExam(id: string): Observable<ModelExam> {
    return this.http.get<ModelExam>(`${this.apiUrl}/${id}`);
  }

  getAllExams(): Observable<ModelExam[]> {
    return this.http.get<ModelExam[]>(this.apiUrl);
  }

  getAvailableExams(): Observable<ModelExam[]> {
    const createApi = this.apiUrlBuilder.buildApiUrl('te_exam');
    return this.http.get<ModelExam[]>(createApi);
  }

  deleteExam(examId: string): Observable<boolean> {
    const updateApi = this.apiUrlBuilder.buildApiUrl(`te_exam/${examId}`);
    return this.http.delete<boolean>(updateApi)
      .pipe(
        catchError(error => this.commonService.handleError(error))
      );
  }
  
}