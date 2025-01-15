import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in months
  features: string[];
  examTypes: string[];
}

export interface PaymentHistory {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  date: Date;
  validUntil: Date;
  status: 'success' | 'pending' | 'failed';
}

export interface AccountInfo {
  subscriptionStatus: 'active' | 'expired';
  currentPlan?: PricingPlan;
  validUntil?: Date;
  examCredits: number;
  totalExamsTaken: number;
}

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private apiUrl = '/api';

  private plans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 99,
      duration: 3,
      features: [
        'Access to Basic Medical Sciences',
        '3 months validity',
        'Basic progress tracking',
        'Email support'
      ],
      examTypes: ['Basic Medical Sciences']
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: 199,
      duration: 6,
      features: [
        'Access to Basic & Clinical Sciences',
        '6 months validity',
        'Detailed progress tracking',
        'Priority email support',
        'Performance analytics'
      ],
      examTypes: ['Basic Medical Sciences', 'Clinical Sciences']
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 299,
      duration: 12,
      features: [
        'Access to all exam types',
        '12 months validity',
        'Advanced progress tracking',
        '24/7 support',
        'Performance analytics',
        'Personalized study plan'
      ],
      examTypes: ['Basic Medical Sciences', 'Clinical Sciences', 'Medical Ethics']
    }
  ];

  private mockPaymentHistory: PaymentHistory[] = [
    {
      id: 'pay1',
      planId: 'standard',
      planName: 'Standard Plan',
      amount: 0,
      date: new Date('2024-01-01'),
      validUntil: new Date('2025-07-31'),
      status: 'success'
    }
  ];

  private mockAccountInfo: AccountInfo = {
    subscriptionStatus: 'active',
    currentPlan: this.plans[1],
    validUntil: new Date('2025-07-31'),
    examCredits: 10,
    totalExamsTaken: 0
  };
  constructor(private http: HttpClient) {}

  /** */
  // Get all plans
  getPlans1(): Observable<PricingPlan[]> {
    return this.http.get<PricingPlan[]>(`${this.apiUrl}/plans`).pipe(
      catchError(error => throwError(() => new Error(`Failed to fetch plans: ${error.message}`)))
    );
  }

  // Get a specific plan by ID
  getPlan1(planId: string): Observable<PricingPlan> {
    return this.http.get<PricingPlan>(`${this.apiUrl}/plans/${planId}`).pipe(
      catchError(error => throwError(() => new Error(`Failed to fetch plan: ${error.message}`)))
    );
  }

  // Get payment history
  getPaymentHistory1(): Observable<PaymentHistory[]> {
    return this.http.get<PaymentHistory[]>(`${this.apiUrl}/payments`).pipe(
      map(history => history.map(payment => ({
        ...payment,
        date: new Date(payment.date),
        validUntil: new Date(payment.validUntil)
      }))),
      catchError(error => throwError(() => new Error(`Failed to fetch payment history: ${error.message}`)))
    );
  }

  // Get account info
  getAccountInfo1(): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(`${this.apiUrl}/account`).pipe(
      map(accountInfo => ({
        ...accountInfo,
        validUntil: accountInfo.validUntil ? new Date(accountInfo.validUntil) : undefined
      })),
      catchError(error => throwError(() => new Error(`Failed to fetch account info: ${error.message}`)))
    );
  }

  // Process payment for a specific plan
  processPayment1(planId: string, paymentDetails: any): Observable<PaymentHistory> {
    return this.http.post<PaymentHistory>(`${this.apiUrl}/payments`, { planId, paymentDetails }).pipe(
      map(payment => ({
        ...payment,
        date: new Date(payment.date),
        validUntil: new Date(payment.validUntil)
      })),
      catchError(error => throwError(() => new Error(`Failed to process payment: ${error.message}`)))
    );
  }

  // Update account information with a new plan and validity
  updateAccountInfo1(plan: PricingPlan, validUntil: Date): Observable<AccountInfo> {
    return this.http.put<AccountInfo>(`${this.apiUrl}/account`, { plan, validUntil }).pipe(
      map(accountInfo => ({
        ...accountInfo,
        validUntil: new Date(accountInfo.validUntil as any)
      })),
      catchError(error => throwError(() => new Error(`Failed to update account info: ${error.message}`)))
    );
  }
  /** */

  getPlans(): Observable<PricingPlan[]> {
    return of(this.plans);
  }

  getPlan(planId: string): Observable<PricingPlan> {
    const plan = this.plans.find(p => p.id === planId);
    return plan ? of(plan) : throwError(() => new Error('Plan not found'));
  }

  getPaymentHistory(): Observable<PaymentHistory[]> {
    return of(this.mockPaymentHistory.sort((a, b) => 
      b.date.getTime() - a.date.getTime()
    ));
  }

  getAccountInfo(): Observable<AccountInfo> {
    return of(this.mockAccountInfo);
  }

  processPayment(planId: string, paymentDetails: any): Observable<PaymentHistory> {
    const plan = this.plans.find(p => p.id === planId);
    if (!plan) {
      return throwError(() => new Error('Plan not found'));
    }

    const payment: PaymentHistory = {
      id: 'pay' + Date.now(),
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      date: new Date(),
      validUntil: new Date(Date.now() + plan.duration * 30 * 24 * 60 * 60 * 1000),
      status: 'success'
    };

    this.mockPaymentHistory.push(payment);
    this.updateAccountInfo(plan, payment.validUntil);
    
    return of(payment);
  }

  private updateAccountInfo(plan: PricingPlan, validUntil: Date) {
    this.mockAccountInfo = {
      ...this.mockAccountInfo,
      subscriptionStatus: 'active',
      currentPlan: plan,
      validUntil: validUntil
    };
  }
}