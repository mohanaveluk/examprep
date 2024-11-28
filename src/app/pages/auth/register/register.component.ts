import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public name!: string;
  public email!: string;
  public password!: string;
  registerForm!: FormGroup;
  errorMessage = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
  onSubmit() {

    let phoneNumber = this.registerForm.value.phone?.replace('+1', '');
    const register = this.registerForm.value;
    //register.mobile = phoneNumber !== undefined ? `+1${phoneNumber}`: null;

    this.authService.register(register).subscribe(response => {
      // Handle successful registration
      this.router.navigate(['/login']);
    }, error => {
      // Handle registration error
      this.errorMessage = error?.error?.message;
      console.error('Registration failed', error);
    });
  }
}
