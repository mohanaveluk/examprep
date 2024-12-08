import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';

export interface Review {
  id: string;
  examId: string;
  userId: string;
  rating: number;
  comment: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  createdAt: Date;
  replies?: ReviewReply[];
  user: UserInfo
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

export interface UserInfo{
  id?: string,
  name?: string,
  profileImage?: string,
  guid?: string
}


@Injectable({
  providedIn: 'root'
})
export class ExamReviewService {
  private apiUrl = '/api/v1/reviews';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private apiUrlBuilder: ApiUrlBuilder

  ) {}

  reviewsByExam(examId: string): Observable<Review[]> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`reviews/exam/${examId}`);
    return this.http.get<Review[]>(endpoint);
  }

  ratingByExam(examId: string): Observable<any> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`reviews/exam/${examId}/rating`);
    return this.http.get<any>(endpoint);
  }

  ratingsAllExam(examId: string): Observable<any[]> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`reviews/ratings/all`);
    return this.http.get<any[]>(endpoint);
  }

  createReview(review: CreateReviewDto): Observable<Review> {
    const createApi = this.apiUrlBuilder.buildApiUrl(`reviews`);
    return this.http.post<Review>(createApi, review);
  }

  addReply(reply: CreateReplyDto): Observable<ReviewReply> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`reviews/reply`);
    return this.http.post<ReviewReply>(endpoint, reply);
  }

  updateReview(reviewId: string, review: Partial<Review>): Observable<Review> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`reviews/${reviewId}`);
    return this.http.put<Review>(endpoint, review);
  }

  deleteReview(reviewId: string): Observable<void> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`reviews/${reviewId}`);
    return this.http.delete<void>(endpoint);
  }

  deleteReply(replyId: string): Observable<void> {
    const endpoint = this.apiUrlBuilder.buildApiUrl(`reviews/reply/${replyId}`);
    return this.http.delete<void>(endpoint);
  }

  // Helper method to determine sentiment based on rating
  private determineSentiment(rating: number): 'positive' | 'negative' | 'neutral' {
    if (rating >= 4) return 'positive';
    if (rating <= 2) return 'negative';
    return 'neutral';
  }
}