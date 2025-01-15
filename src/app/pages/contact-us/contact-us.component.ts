import { Component } from '@angular/core';
import { ContactForm } from './contact.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  contactForm: FormGroup;
  public isSubmitting = false;
  isSubmitted = false;
  loading = false;
  loadingMessage = "Processing..."

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      //examType: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.loading = true;
      let phoneNumber = this.contactForm.value.phone.replace('+1', '');
      let formData: ContactForm = this.contactForm.value;
      formData.mobile = `+1${phoneNumber}`;


      this.contactService.submitContactForm(formData).subscribe({
        next: (response) => {
          this.loading = false;
          this.snackBar.open('Form submitted successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.isSubmitted = true;
          this.contactForm.reset();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open('Error submitting form. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.isSubmitting = false;
        }
      });
    }
  }

  private markAllAsTouched() {
    Object.keys(this.contactForm.controls).forEach(field => {
      const control = this.contactForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
