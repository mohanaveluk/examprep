import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
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
  errorMessage = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
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
