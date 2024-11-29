import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';
import { Exam, Question } from '../models/exam.model';


@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private apiUrl = 'http://localhost:3000/api/exams'; // Replace with your API URL

  constructor(
    private http: HttpClient,
    private apiUrlBuilder: ApiUrlBuilder
  ) { }

  getExams(): Observable<any> {
    // Replace with actual API call
    return of([
      { id: 1, name: 'Physics Exam', description: 'Physics entrance exam' },
      { id: 2, name: 'Chemistry Exam', description: 'Chemistry entrance exam' }
    ]);
  }

  getExam(examId: string): Observable<Exam> {
    // Replace with actual API call
    const createApi = this.apiUrlBuilder.buildApiUrl(`u-exam/${examId}`);
    return this.http.get<Exam>(createApi);    
    //return of({ id: examId, name: 'Physics Exam', description: 'Physics entrance exam' });
  }
  
  getQuestions(examId: number): Observable<any> {
    // Replace with actual API call
    return of([
      { id: 1, text: 'What is the speed of light?', type: 'single', options: ['3x10^8 m/s', '5x10^8 m/s', '1x10^8 m/s'] },
      { id: 2, text: 'Which of the following are noble gases?', type: 'multiple', options: ['Helium', 'Neon', 'Argon', 'Oxygen', 'Nitrogen'] }
    ]);
  }


  //------------------------------

  /*private mockExams: Exam[] = [
    {
      id: '1',
      title: 'Basic Medical Sciences',
      description: 'Test your knowledge in anatomy, physiology, and biochemistry',
      duration: 60,
      totalQuestions: 50,
      passingScore: 70
    },
    {
      id: '2',
      title: 'Clinical Sciences',
      description: 'Comprehensive test covering pathology, pharmacology, and medicine',
      duration: 90,
      totalQuestions: 75,
      passingScore: 75
    },
    {
      id: '3',
      title: 'Medical Ethics & Patient Care',
      description: 'Evaluation of medical ethics and patient care principles',
      duration: 45,
      totalQuestions: 30,
      passingScore: 80
    }
  ];*/

  private mockQuestions: { [key: string]: Question[] } = {
    '1': [
      {
        id: 1,
        text: 'Which of the following is a function of the respiratory system?',
        type: 'multiple',
        maxSelections: 3,
        options: [
          { id: 1, text: 'Gas exchange' },
          { id: 2, text: 'pH regulation' },
          { id: 3, text: 'Heat production' },
          { id: 4, text: 'Blood filtration' },
          { id: 5, text: 'Voice production' }
        ]
      },
      {
        id: 2,
        text: 'The human heart has how many chambers?',
        type: 'single',
        options: [
          { id: 1, text: 'Two' },
          { id: 2, text: 'Three' },
          { id: 3, text: 'Four' },
          { id: 4, text: 'Five' }
        ]
      },
      {
        id: 3,
        text: 'Select the correct components of the cell membrane:',
        type: 'multiple',
        maxSelections: 2,
        options: [
          { id: 1, text: 'Phospholipids' },
          { id: 2, text: 'Proteins' },
          { id: 3, text: 'Nucleic acids' },
          { id: 4, text: 'Glucose' },
          { id: 5, text: 'Cholesterol' }
        ]
      }
    ],
    '2': [
      {
        id: 1,
        text: 'Which antibiotics are effective against gram-positive bacteria?',
        type: 'multiple',
        maxSelections: 3,
        options: [
          { id: 1, text: 'Penicillin' },
          { id: 2, text: 'Vancomycin' },
          { id: 3, text: 'Gentamicin' },
          { id: 4, text: 'Methicillin' },
          { id: 5, text: 'Tetracycline' }
        ]
      },
      {
        id: 2,
        text: 'What is the most common cause of community-acquired pneumonia?',
        type: 'single',
        options: [
          { id: 1, text: 'Streptococcus pneumoniae' },
          { id: 2, text: 'Haemophilus influenzae' },
          { id: 3, text: 'Mycoplasma pneumoniae' },
          { id: 4, text: 'Klebsiella pneumoniae' }
        ]
      }
    ],
    '3': [
      {
        id: 1,
        text: 'Which of the following are key principles of medical ethics?',
        type: 'multiple',
        maxSelections: 2,
        options: [
          { id: 1, text: 'Autonomy' },
          { id: 2, text: 'Beneficence' },
          { id: 3, text: 'Profit maximization' },
          { id: 4, text: 'Time efficiency' }
        ]
      },
      {
        id: 2,
        text: 'What is the primary consideration in patient care?',
        type: 'single',
        options: [
          { id: 1, text: 'Patient well-being' },
          { id: 2, text: 'Hospital protocols' },
          { id: 3, text: 'Insurance coverage' },
          { id: 4, text: 'Treatment cost' }
        ]
      }
    ]
  };

  getAvailableExams(): Observable<Exam[]> {
    const createApi = this.apiUrlBuilder.buildApiUrl('u-exam');
    return this.http.get<Exam[]>(createApi);
    //return of(this.mockExams);
  }

  getQuestion(examId: string, index: number): Observable<{ question: Question, totalQuestions: number }> {
    const questions = this.mockQuestions[examId];
    return of({
      question: questions[index % questions.length],
      totalQuestions: questions.length
    });
  }

  submitExam(examId: string, answers: any[]): Observable<any> {
    // Simulate API response with mock result
    const mockResult = {
      passed: Math.random() > 0.3,
      score: Math.floor(Math.random() * 30) + 70,
      sectionScores: [
        {
          name: 'Theory Knowledge',
          score: Math.floor(Math.random() * 20) + 80,
          feedback: 'Strong understanding of theoretical concepts'
        },
        {
          name: 'Practical Application',
          score: Math.floor(Math.random() * 30) + 70,
          feedback: 'Good practical knowledge with room for improvement'
        }
      ],
      recommendations: [
        'Focus on understanding core concepts',
        'Practice more clinical case studies',
        'Review latest medical research and guidelines'
      ]
    };
    return of(mockResult);
  }

  getExamResult(examId: string): Observable<any> {
    // Return the same mock result structure
    return this.submitExam(examId, []);
  }


}
