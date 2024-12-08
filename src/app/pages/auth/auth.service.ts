import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, tap } from 'rxjs';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';
import { TokenService } from '../../core/services/token.service';
export interface UserModel{
  id: string,
  email: string,
  firstName: string,
  lastName?: string,
  role: string
}

export interface UserResponse{
  status: boolean,
  message: string,
  access_token: string,
  user: UserModel
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AUTH_TOKEN = 'lrpd_opr';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private userName!: string;
  private user!: UserModel;
  private isAuthenticated = false;
  
  private apiUrl = 'http://localhost:3000/api/auth'; // Replace with your API URL

  constructor(private http: HttpClient, private apiUrlBuilder: ApiUrlBuilder, private tokenService: TokenService) {
    this.userName = localStorage.getItem('userName') || '';
    const userobj  = localStorage?.getItem('user');
    this.user = userobj !== null ? JSON.parse(userobj) : {};
  }

  register(register: any): Observable<any> {
    const createApi = this.apiUrlBuilder.buildApiUrl('auth/register');
    return this.http.post(`${createApi}`, register);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    const createApi = this.apiUrlBuilder.buildApiUrl('auth/login');
    return this.http.post(`${createApi}`, credentials).pipe(
      tap((response: any) => {
        if (response.status) {
          this.userName = `${response?.user.firstName} ${response?.user.lastName}`;
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('userName', this.userName);
          localStorage.setItem(this.AUTH_TOKEN, response.access_token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  login2(email: string, password: string, credentials: { email: string; password: string; }): Observable<boolean> {
    // Simulate API call
    return of(true).pipe(
      delay(1000),
      tap(() => (this.isAuthenticated = true))
    );
  }

  login1(credentials: { email: string; password: string }): Observable<any> {
    // Simulate API call
    return of({ success: true, userName: 'John Doe' }).pipe(
      tap(response => {
        if (response.success) {
          this.userName = response.userName;
          localStorage.setItem('userName', response.userName);
          this.loggedIn.next(true);
        }
      })
    );
  }


  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem(this.AUTH_TOKEN);
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
    this.tokenService.removeToken();
    this.loggedIn.next(false);
    this.userName = "";
  }

  isLoggedIn(): boolean {
    this.loggedIn.next(false);
    
    this.userName =  localStorage.getItem(this.AUTH_TOKEN) || '';
    return this.isAuthenticated;
    //return this.tokenService.hasToken();
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
  
  getUserName(): string {
    return this.userName;
  }

  getUser(): any {
    return localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')!) : {id: ""};
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.AUTH_TOKEN);
  }

}
