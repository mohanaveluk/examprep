import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExamResult } from '../../models/exam-result.interface';

@Injectable({
  providedIn: 'root'
})
export class ExamResultService {
  private resultSubject = new BehaviorSubject<ExamResult | null>(null);
  result$ = this.resultSubject.asObservable();

  setResult(result: ExamResult): void {
    this.resultSubject.next(result);
  }

  getResult(): Observable<ExamResult | null> {
    return this.result$;
  }

  clearResult(): void {
    this.resultSubject.next(null);
  }
}