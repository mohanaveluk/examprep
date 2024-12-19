import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';
import { CommonService } from '../../shared/services/common.service';
import { ModelExam, ModelExamResponse } from '../models/exam.model';

@Injectable({
  providedIn: 'root'
})
export class ModelExamService {

    constructor(private http: HttpClient, 
        private apiUrlBuilder: ApiUrlBuilder, 
        private commonService: CommonService) { }

    //catchError(error => this.commonService.handleError(error, {}, false))
    getExams(): Observable<ModelExam[]> {
        const createApi = this.apiUrlBuilder.buildApiUrl(`te_exam`);
        return this.http.get<ModelExamResponse>(createApi).pipe(
            map((response: { data: any; }) => response.data),
            catchError(error => this.commonService.handleError(error))
        );
    }

    getExam(examId: string): Observable<ModelExam> {
        const customErrors = {
            404: 'The requested data was not found',
            403: 'You are not authorized to access this data'
        };
        const createApi = this.apiUrlBuilder.buildApiUrl(`te_exam/${examId}`);
        return this.http.get<ModelExam>(createApi).pipe(
            catchError(this.commonService.createErrorHandler(customErrors))
        );
    }
}