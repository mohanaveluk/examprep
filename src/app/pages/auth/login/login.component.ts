import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, SocialAuthResponse } from '../auth.service';
import { LoginRequest } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  public email = ''
  public password = ''
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage = null;
  showOtcLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  onSubmit() {
    if (this.loginForm.valid) {
      const loginRequest: LoginRequest  = {email: this.loginForm.value.email, password: this.loginForm.value.password};
      this.authService.login(this.loginForm.value).subscribe( {
        next: (response) => {
          const redirectUrl = this.authService.redirectUrl || '/exam/list'; // Default to home if no redirect URL
          this.router.navigateByUrl(redirectUrl);
          this.authService.redirectUrl = null; // Clear redirectUrl
          //this.router.navigate(['/exam/list']);
          console.log(response);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'An error occurred during login';
          console.error('Login failed:', error);
        }
      });
    }
  }

  onSocialLogin(provider: string): void {
    this.authService.socialLogin(provider).then((observable) => {
      observable.subscribe({
        next: (response: SocialAuthResponse) => {
          console.log('Login successful:', response);
          this.router.navigate(['/exam/list']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.snackBar.open(`${provider} login failed: ${error.message}`, 'Close');
        }
      });
    }).catch((error) => {
      console.error('Error initiating social login:', error);
      // Handle error in initiating social login
    });
  }

  onSendOtc(mobile: string): void {
    this.authService.sendOtc(mobile).subscribe({
      next: () => {
        this.snackBar.open('One-time code sent to your mobile number', 'Close');
      },
      error: (error: { message: any; }) => {
        this.snackBar.open(`Failed to send code: ${error.message}`, 'Close');
      }
    });
  }

  onVerifyOtc(data: {mobile: string, code: string}): void {
    this.authService.verifyOtc(data.mobile, data.code).subscribe({
      next: () => this.router.navigate(['/exam/list']),
      error: (error: { message: any; }) => {
        this.snackBar.open(`Verification failed: ${error.message}`, 'Close');
      }
    });
  }

  toggleOtcLogin(): void {
    this.showOtcLogin = !this.showOtcLogin;
  }


  /*onSubmit1() {
    this.authService.login(this.email, this.password).subscribe(response => {
      // Handle successful login
      this.router.navigate(['/exams']);
    }, error => {
      // Handle login error
      console.error('Login failed', error);
    });
  }
  */
}
