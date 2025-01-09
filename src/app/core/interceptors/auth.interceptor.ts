import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { SessionExpiredDialogComponent } from '../../shared/components/session-expired-dialog/session-expired-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../pages/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.tokenService.getToken();

    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error?.error?.message?.includes("Password is incorrect") || error?.error?.message?.includes("Invalid User Id") || error?.error?.message?.includes("verification code has been sent")){
          return throwError(() => error);
        }
        if (error.status === 401 && !this.isRefreshing) {
          return this.handle401Error(request, next);
          // Check if dialog is not already open
          /*if (!this.dialog.openDialogs.length) {
            this.tokenService.removeTokens();
            const dialogRef = this.dialog.open(SessionExpiredDialogComponent, {
              width: '400px',
              disableClose: true
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result === 'login') {
                this.router.navigate(['/auth/login']);
              } else {
                this.router.navigate(['/']);
              }
            });
          }*/
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.authService.refreshToken().pipe(
        switchMap(response => {
          this.isRefreshing = false;
          return next.handle(this.addToken(request, response.access_token));
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.tokenService.removeTokens();
          return throwError(() => error);
        })
      );
    }
    return next.handle(request);
  }


}