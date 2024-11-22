import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface Review {
  id: string;
  examId: string;
  userId: string;
  rating: number;
  comment: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  createdAt: Date;
  replies?: ReviewReply[];
}

export interface ReviewReply {
  id: string;
  reviewId: string;
  userId: string;
  comment: string;
  createdAt: Date;
}

export interface CreateReviewDto {
  examId: string;
  rating: number;
  comment: string;
}

export interface CreateReplyDto {
  reviewId: string;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExamReviewService {
  private apiUrl = '/api/reviews';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getReviewsByExam(examId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/exam/${examId}`);
  }

  createReview(review: CreateReviewDto): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  addReply(reply: CreateReplyDto): Observable<ReviewReply> {
    return this.http.post<ReviewReply>(`${this.apiUrl}/reply`, reply);
  }

  updateReview(reviewId: string, review: Partial<Review>): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/${reviewId}`, review);
  }

  deleteReview(reviewId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`);
  }

  deleteReply(replyId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reply/${replyId}`);
  }

  // Helper method to determine sentiment based on rating
  private determineSentiment(rating: number): 'positive' | 'negative' | 'neutral' {
    if (rating >= 4) return 'positive';
    if (rating <= 2) return 'negative';
    return 'neutral';
  }
}