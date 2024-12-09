import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { UserInfo } from '../exam-review/exam-review.service';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';

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
  user?: UserInfo;
}

export interface Response {
  id: string;
  questionId: string;
  content: string;
  createdAt: Date;
  user?: UserInfo;
  followUps: FollowUp[];
}

export interface Stats {
  today: number;
  thisMonth: number;
  lastMonth: number;
  total: number;
  answered: number;
  pending: number;
}

export interface FollowUp {
  id: string;
  content: string;
  status: string;
  createdAt: Date;
  responses: Response[];
}

export interface CreateFollowUpDto {
  content: string;
  responseId: string;
}

export interface CreateResponseDto {
  content: string;
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
      user: {
        "id": "2",
            "name": "Kannappan Samuvel",
            "profileImage": "",
            "guid": "aee0671c-41bc-422c-a9bf-dbf1e86d0dd5"
      },
      responses: [
        {
          id: 'r1',
          questionId: '1',
          content: 'The human heart is a muscular organ divided into four chambers: two upper atria and two lower ventricles...',
          createdAt: new Date('2024-11-15T11:00:00'),
          user: {},
          followUps: []
        }
      ]
    },
    {
      id: '2',
      studentId: 'student1',
      subject: 'Biochemistry Doubt',
      content: 'What is the role of enzymes in cellular metabolism?',
      createdAt: new Date('2024-10-16T14:20:00'),
      status: 'pending',
      user: {
        "id": "2",
            "name": "Kannappan Samuvel",
            "profileImage": "",
            "guid": "aee0671c-41bc-422c-a9bf-dbf1e86d0dd5"
      },
    },
    {
      id: '3',
      studentId: 'student1',
      subject: 'Physiology Question',
      content: 'How does the nervous system transmit signals?',
      createdAt: new Date('2024-11-08T09:15:00'),
      status: 'answered',
      user: {
        "id": "2",
            "name": "Kannappan Samuvel",
            "profileImage": "",
            "guid": "aee0671c-41bc-422c-a9bf-dbf1e86d0dd5"
      },
      responses: [
        {
          id: 'r2',
          questionId: '3',
          content: 'The nervous system transmits signals through electrical impulses called action potentials...',
          createdAt: new Date('2024-11-08T16:00:00'),
          user: {},
          followUps: []
        }
      ]
    }
  ];


  constructor(
    private http: HttpClient,     
    private apiUrlBuilder: ApiUrlBuilder
  ) {
    this.checkNewResponses();
  }

  askQuestion(question: Partial<Question>): Observable<Question> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`inquiries/`);
    return this.http.post<Question>(endpoint, question);
  }

  getQuestions(): Observable<Question[]> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`inquiries/`);
    return this.http.get<Question[]>(endpoint);
  }

  getQuestion(id: string): Observable<Question> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`inquiries/${id}`);
    return this.http.get<Question>(endpoint);
  }

  addResponse(questionId: string, content: string): Observable<Response> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`inquiries/${questionId}/responses`);
    return this.http.post<Response>(endpoint, { content });
  }

  addFollowUp(responseId: string, followUp: CreateFollowUpDto): Observable<FollowUp> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`inquiries/responses/${responseId}/follow-up`);
    return this.http.post<FollowUp>(
      endpoint,
      followUp
    );
  }

  addResponseToFollowUp(followUpId: string, response: CreateResponseDto): Observable<Response> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`inquiries/follow-up/${followUpId}/responses`);
    return this.http.post<Response>(
      endpoint,
      response
    );
  }

  getStats(): Observable<Stats> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`inquiries/stats`);
    return this.http.get<Stats>(endpoint);
  }

  private checkNewResponses() {
    // Poll for new responses every minute
    const endpoint = this.apiUrlBuilder.buildApiUrl(`inquiries/notifications`);
    setInterval(() => {
      this.http.get<number>(endpoint)
        .subscribe(count => this.notificationsSubject.next(count));
    }, 60000);
  }

  markAsRead(questionId: string): Observable<void> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`inquiries/${questionId}/read`);
    return this.http.post<void>(endpoint, {});
  }

 

  /* static functions*/

  askQuestion1(question: Partial<Question>): Observable<Question> {
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

  getQuestions1(): Observable<Question[]> {
    return of(this.mockQuestions).pipe(delay(500));
  }

  getQuestion1(id: string): Observable<Question> {
    const question = this.mockQuestions.find(q => q.id === id);
    if (!question) {
      return of({
        id: '0',
        studentId: 'unknown',
        subject: 'Not Found',
        content: 'Question not found',
        createdAt: new Date(),
        status: 'pending',
        user: {}
      });
    }
    return of(question).pipe(delay(500));
  }

  addResponse1(questionId: string, content: string): Observable<Response> {
    const question = this.mockQuestions.find(q => q.id === questionId);
    if (question) {
      const newResponse: Response = {
        id: `r${Date.now()}`,
        questionId,
        content,
        createdAt: new Date(),
        user: {},
          followUps: []
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
      user: {},
          followUps: []
    }).pipe(delay(500));
  }

  
  getStats1(): Observable<Stats> {
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

  private checkNewResponses1() {
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

  markAsRead1(questionId: string): Observable<void> {
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