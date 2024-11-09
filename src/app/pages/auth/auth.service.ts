import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userName!: string;
  private isAuthenticated = false;

  private apiUrl = 'http://localhost:3000/api/auth'; // Replace with your API URL

  constructor(private http: HttpClient) {
    this.userName = localStorage.getItem('userName') || '';
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  login1(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  login2(email: string, password: string, credentials: { email: string; password: string; }): Observable<boolean> {
    // Simulate API call
    return of(true).pipe(
      delay(1000),
      tap(() => (this.isAuthenticated = true))
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    // Simulate API call
    return of({ success: true, userName: 'John Doe' }).pipe(
      tap(response => {
        if (response.success) {
          this.userName = response.userName;
          localStorage.setItem('token', 'your-token'); // Replace with actual token
          localStorage.setItem('userName', response.userName);
          this.loggedIn.next(true);
        }
      })
    );
  }


  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.loggedIn.next(false);
    this.userName = "";
  }

  isLoggedIn(): boolean {
    this.loggedIn.next(false);
    this.userName =  ""; //localStorage.getItem('userName') || '';
    return this.isAuthenticated;

  }

  isUserLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  
  getUserName(): string {
    return this.userName;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

}
