import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
export interface Question {
  id: string;
  studentId: string;
  subject: string;
  content: string;
  createdAt: Date;
  status: 'pending' | 'answered';
  responses?: Response[];
  isToday?: boolean;        // New property to indicate if the question was created today
  isThisMonth?: boolean;    // New property to indicate if the question was created this month
  isLastMonth?: boolean;    // New property to indicate if the question was created last month
}

export interface Response {
  id: string;
  questionId: string;
  content: string;
  createdAt: Date;
  adminId: string;
}

export interface Stats {
  today: number;
  thisMonth: number;
  lastMonth: number;
  total: number;
  answered: number;
  pending: number;
}

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private notificationsSubject = new BehaviorSubject<number>(0);
  notifications$ = this.notificationsSubject.asObservable();

  private mockQuestions: Question[] = [
    {
      id: '1',
      studentId: 'student1',
      subject: 'Question about Anatomy',
      content: 'Can you explain the structure of the human heart in detail?',
      createdAt: new Date('2024-11-15T10:30:00'),
      status: 'answered',
      responses: [
        {
          id: 'r1',
          questionId: '1',
          content: 'The human heart is a muscular organ divided into four chambers: two upper atria and two lower ventricles...',
          createdAt: new Date('2024-11-15T11:00:00'),
          adminId: 'admin1'
        }
      ]
    },
    {
      id: '2',
      studentId: 'student1',
      subject: 'Biochemistry Doubt',
      content: 'What is the role of enzymes in cellular metabolism?',
      createdAt: new Date('2024-10-16T14:20:00'),
      status: 'pending'
    },
    {
      id: '3',
      studentId: 'student1',
      subject: 'Physiology Question',
      content: 'How does the nervous system transmit signals?',
      createdAt: new Date('2024-11-08T09:15:00'),
      status: 'answered',
      responses: [
        {
          id: 'r2',
          questionId: '3',
          content: 'The nervous system transmits signals through electrical impulses called action potentials...',
          createdAt: new Date('2024-11-08T16:00:00'),
          adminId: 'admin2'
        }
      ]
    }
  ];


  constructor(private http: HttpClient) {
    this.checkNewResponses();
  }

  askQuestion1(question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>('/api/inquiries', question);
  }

  getQuestions1(): Observable<Question[]> {
    return this.http.get<Question[]>('/api/inquiries');
  }

  getQuestion1(id: string): Observable<Question> {
    return this.http.get<Question>(`/api/inquiries/${id}`);
  }

  addResponse1(questionId: string, content: string): Observable<Response> {
    return this.http.post<Response>(`/api/inquiries/${questionId}/responses`, { content });
  }

  getStats1(): Observable<Stats> {
    return this.http.get<Stats>('/api/inquiries/stats');
  }

  private checkNewResponses1() {
    // Poll for new responses every minute
    setInterval(() => {
      this.http.get<number>('/api/inquiries/notifications')
        .subscribe(count => this.notificationsSubject.next(count));
    }, 60000);
  }

  markAsRead1(questionId: string): Observable<void> {
    return this.http.post<void>(`/api/inquiries/${questionId}/read`, {});
  }

  /* static functions*/

  askQuestion(question: Partial<Question>): Observable<Question> {
    const newQuestion: Question = {
      id: (this.mockQuestions.length + 1).toString(),
      studentId: 'student1',
      subject: question.subject || '',
      content: question.content || '',
      createdAt: new Date(),
      status: 'pending'
    };

    this.mockQuestions.unshift(newQuestion);
    return of(newQuestion).pipe(delay(500));
  }

  getQuestions(): Observable<Question[]> {
    return of(this.mockQuestions).pipe(delay(500));
  }

  getQuestion(id: string): Observable<Question> {
    const question = this.mockQuestions.find(q => q.id === id);
    if (!question) {
      return of({
        id: '0',
        studentId: 'unknown',
        subject: 'Not Found',
        content: 'Question not found',
        createdAt: new Date(),
        status: 'pending'
      });
    }
    return of(question).pipe(delay(500));
  }

  addResponse(questionId: string, content: string): Observable<Response> {
    const question = this.mockQuestions.find(q => q.id === questionId);
    if (question) {
      const newResponse: Response = {
        id: `r${Date.now()}`,
        questionId,
        content,
        createdAt: new Date(),
        adminId: 'student1'
      };

      if (!question.responses) {
        question.responses = [];
      }
      question.responses.push(newResponse);
      question.status = 'answered';

      return of(newResponse).pipe(delay(500));
    }
    return of({
      id: '0',
      questionId: '0',
      content: 'Failed to add response',
      createdAt: new Date(),
      adminId: 'unknown'
    }).pipe(delay(500));
  }

  
  getStats(): Observable<Stats> {
    const today = new Date();
    const lastMonthDate = new Date(today);
    lastMonthDate.setMonth(today.getMonth() - 1);

    this.mockQuestions.forEach(question => {
      const questionDate = new Date(question.createdAt);
      question.isToday = questionDate.toDateString() === today.toDateString();
      question.isThisMonth = questionDate.getMonth() === today.getMonth() &&
                             questionDate.getFullYear() === today.getFullYear();
      question.isLastMonth = questionDate.getMonth() === lastMonthDate.getMonth() &&
                             questionDate.getFullYear() === lastMonthDate.getFullYear();
    });

    const stats: Stats = {
      today: this.mockQuestions.filter(q => q.isToday).length,
      thisMonth: this.mockQuestions.filter(q => q.isThisMonth).length,
      lastMonth: this.mockQuestions.filter(q => q.isLastMonth).length,
      total: this.mockQuestions.length,
      answered: this.mockQuestions.filter(q => q.status === 'answered').length,
      pending: this.mockQuestions.filter(q => q.status === 'pending').length
    };

    return of(stats).pipe(delay(500));
  }


  getStats_old(): Observable<Stats> {
    const today = new Date();
    const thisMonth = this.mockQuestions.filter(q => 
      q.createdAt.getMonth() === today.getMonth() && 
      q.createdAt.getFullYear() === today.getFullYear()
    ).length;

    const lastMonth = this.mockQuestions.filter(q => {
      const date = new Date(q.createdAt);
      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      return date.getMonth() === lastMonthDate.getMonth() && 
             date.getFullYear() === lastMonthDate.getFullYear();
    }).length;

    const stats: Stats = {
      today: this.mockQuestions.filter(q => 
        q.createdAt.toDateString() === today.toDateString()
      ).length,
      thisMonth,
      lastMonth,
      total: this.mockQuestions.length,
      answered: this.mockQuestions.filter(q => q.status === 'answered').length,
      pending: this.mockQuestions.filter(q => q.status === 'pending').length
    };

    return of(stats).pipe(delay(500));
  }

  private checkNewResponses() {
    // Simulate checking for new responses every minute
    setInterval(() => {
      const newResponses = this.mockQuestions.reduce((count, question) => {
        if (question.responses && question.responses.some(r => 
          new Date().getTime() - new Date(r.createdAt).getTime() < 300000 // 5 minutes
        )) {
          return count + 1;
        }
        return count;
      }, 0);
      
      this.notificationsSubject.next(newResponses);
    }, 60000);
  }

  markAsRead(questionId: string): Observable<void> {
    // Simulate marking a question as read
    return of(undefined).pipe(
      delay(500),
      tap(() => {
        const currentNotifications = this.notificationsSubject.value;
        if (currentNotifications > 0) {
          this.notificationsSubject.next(currentNotifications - 1);
        }
      })
    );
  }

}