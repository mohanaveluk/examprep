import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { SessionExpiredDialogComponent } from '../../shared/components/session-expired-dialog/session-expired-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Check if dialog is not already open
          if (!this.dialog.openDialogs.length) {
            this.tokenService.removeToken();
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
          }
        }
        return throwError(() => error);
      })
    );
  }


}