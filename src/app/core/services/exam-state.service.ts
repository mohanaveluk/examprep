import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ExamTiming {
  startTime: Date;
  endTime: Date;
  duration: number;
  examId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExamStateService {
  private examTimingSubject = new BehaviorSubject<ExamTiming | null>(null);
  examTiming$ = this.examTimingSubject.asObservable();

  setExamTiming(timing: ExamTiming): void {
    this.examTimingSubject.next(timing);
  }

  clearExamTiming(): void {
    this.examTimingSubject.next(null);
  }

  getExamTiming(): Observable<ExamTiming | null> {
    return this.examTiming$;
  }
}