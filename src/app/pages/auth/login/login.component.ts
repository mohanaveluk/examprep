import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  public email = ''
  public password = ''
  loginForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe( {
        next: (response) => {
          this.router.navigate(['/exam/list']);
          console.log(response);
        },
        error: (error) => console.error('Login failed:', error)
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
