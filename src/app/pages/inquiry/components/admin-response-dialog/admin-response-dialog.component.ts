import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InquiryService, Question } from '../../inquiry.service';

@Component({
  selector: 'app-admin-response-dialog',
  templateUrl: './admin-response-dialog.component.html',
  styleUrl: './admin-response-dialog.component.scss'
})
export class AdminResponseDialogComponent {
  responseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inquiryService: InquiryService,
    private dialogRef: MatDialogRef<AdminResponseDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public question: Question
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
          this.dialogRef.close(true);
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

  onClose(): void {
    this.dialogRef.close();
  }
}
