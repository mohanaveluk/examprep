import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InquiryService, Question } from '../../inquiry.service';

@Component({
  selector: 'app-admin-response',
  templateUrl: './admin-response.component.html',
  styleUrls: ['./admin-response.component.css']
})
export class AdminResponseComponent {
  @Input() question!: Question;
  @Output() responseAdded = new EventEmitter<void>();

  responseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inquiryService: InquiryService,
    private snackBar: MatSnackBar
  ) {
    this.responseForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.responseForm.valid) {
      this.inquiryService.addResponse(
        this.question.id,
        this.responseForm.get('content')?.value
      ).subscribe({
        next: () => {
          this.snackBar.open('Response submitted successfully', 'Close', {
            duration: 3000
          });
          this.responseForm.reset();
          this.responseAdded.emit();
        },
        error: (error) => {
          this.snackBar.open('Failed to submit response', 'Close', {
            duration: 3000
          });
          console.error('Error submitting response:', error);
        }
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}