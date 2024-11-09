import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TestResult {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  status: 'Pass' | 'Fail';
  takenAt: Date;
  sectionScores: {
    name: string;
    score: number;
    feedback: string;
  }[];
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TestHistoryService {
  private apiUrl = '/api/test-history';

  
  private mockResults: TestResult[] = [
    {
      id: '1',
      examId: '1',
      examTitle: 'Basic Medical Sciences',
      score: 85,
      status: 'Pass',
      takenAt: new Date('2024-01-15T10:30:00'),
      sectionScores: [
        {
          name: 'Anatomy',
          score: 90,
          feedback: 'Excellent understanding of human anatomy'
        },
        {
          name: 'Physiology',
          score: 80,
          feedback: 'Good grasp of body systems'
        }
      ],
      recommendations: [
        'Review cardiovascular system',
        'Practice more case studies'
      ]
    },
    {
      id: '2',
      examId: '2',
      examTitle: 'Clinical Sciences',
      score: 65,
      status: 'Fail',
      takenAt: new Date('2024-01-10T14:20:00'),
      sectionScores: [
        {
          name: 'Pathology',
          score: 60,
          feedback: 'Needs improvement in disease mechanisms'
        },
        {
          name: 'Pharmacology',
          score: 70,
          feedback: 'Fair understanding of drug actions'
        }
      ],
      recommendations: [
        'Focus on pathology concepts',
        'Review drug interactions'
      ]
    }
  ];

  constructor(private http: HttpClient) {}
  
  // Fetch all test history
  getTestHistory1(): Observable<TestResult[]> {
    return this.http.get<TestResult[]>(this.apiUrl).pipe(
      map(results => 
        results.map(result => ({
          ...result,
          takenAt: new Date(result.takenAt)
        }))
      )
    );
  }

  // Fetch specific test detail by ID
  getTestDetail1(id: string): Observable<TestResult | undefined> {
    return this.http.get<TestResult>(`${this.apiUrl}/${id}`).pipe(
      map(result => ({
        ...result,
        takenAt: new Date(result.takenAt)
      }))
    );
  }


  getTestHistory(): Observable<TestResult[]> {
    return of(this.mockResults.sort((a, b) => 
      b.takenAt.getTime() - a.takenAt.getTime()
    ));
  }

  getTestDetail(id: string): Observable<TestResult | undefined> {
    return of(this.mockResults.find(result => result.id === id));
  }
}