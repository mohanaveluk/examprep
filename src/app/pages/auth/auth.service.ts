import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, delay, Observable, of, tap, throwError } from 'rxjs';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';
import { TokenService } from '../../core/services/token.service';
import { AuthResponse, LoginRequest, RefreshTokenRequest, RefreshTokenResponse, UserModel } from '../../shared/models/auth.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AUTH_TOKEN = 'lrpd_opr';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userName!: string;
  private user!: UserModel;
  private isAuthenticated = false;
  public redirectUrl: string | null = null;

  constructor(
    private http: HttpClient, 
    private apiUrlBuilder: ApiUrlBuilder, 
    private tokenService: TokenService,
    private router: Router
  ) {
    this.isAuthenticatedSubject.next(this.tokenService.hasValidAccessToken());
    this.userName = localStorage.getItem('userName') || '';
    const userobj  = localStorage?.getItem('user');
    this.user = userobj !== null ? JSON.parse(userobj) : {};
  }

  register(register: any): Observable<AuthResponse> {
    const createApi = this.apiUrlBuilder.buildApiUrl('auth/register');
    return this.http.post<AuthResponse>(`${createApi}`, register).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => throwError(() => error))
    );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    const createApi = this.apiUrlBuilder.buildApiUrl('auth/login');
    return this.http.post<AuthResponse>(createApi, request).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => throwError(() => error))
    );
  }

  login_prev(credentials: { email: string; password: string }): Observable<AuthResponse> {
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


  logout(): Observable<any> {
    const createApi = this.apiUrlBuilder.buildApiUrl('auth/logout');

    return this.http.post<string>(createApi, {}).pipe(
      tap(() => {
        this.tokenService.removeTokens();
        this.isAuthenticatedSubject.next(false);
        this.isAuthenticated = false;
        this.loggedIn.next(false);
        this.userName = "";
        this.router.navigate(['/auth/login']);
      }),
      catchError(error => throwError(() => console.log(error)))
    );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };
    const createApi = this.apiUrlBuilder.buildApiUrl('token/refresh');
    return this.http.post<RefreshTokenResponse>(createApi, request).pipe(
      tap(response => {
        this.tokenService.setAccessToken(response.access_token);
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => throwError(() => console.log(error)))
    );
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

  private handleAuthResponse(response: AuthResponse): void {
    if (response.access_token && response.refresh_token) {
      this.tokenService.setTokens(response.access_token, response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      this.userName = `${response?.user?.firstName} ${response?.user?.lastName}`;
      localStorage.setItem('userName', this.userName);
      this.isAuthenticatedSubject.next(true);
      this.loggedIn.next(true);
    }
  }
}
