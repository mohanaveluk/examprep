import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FollowUp, InquiryService, Question } from '../../inquiry.service';

interface DialogData {
  question: Question;
  followUp?: FollowUp;
}

@Component({
  selector: 'app-admin-response-dialog',
  templateUrl: './admin-response-dialog.component.html',
  styleUrl: './admin-response-dialog.component.scss'
})
export class AdminResponseDialogComponent {
  responseForm: FormGroup;
  isFollowUpResponse!: boolean;

  constructor(
    private fb: FormBuilder,
    private inquiryService: InquiryService,
    private dialogRef: MatDialogRef<AdminResponseDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.responseForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.isFollowUpResponse = !!data.followUp;
  }

  onSubmit() {
    if (this.responseForm.valid) {
      const content = this.responseForm.get('content')?.value;

      if (this.isFollowUpResponse && this.data.followUp) {
        // Handle response to follow-up
        this.inquiryService.addResponseToFollowUp(
          this.data.followUp.id,
          { content }
        ).subscribe({
          next: () => this.handleSuccess('Response to follow-up submitted successfully'),
          error: (error) => this.handleError(error)
        });
      } else {
        // Handle regular response
        this.inquiryService.addResponse(
          this.data.question.id,
          content
        ).subscribe({
          next: () => this.handleSuccess('Response submitted successfully'),
          error: (error) => this.handleError(error)
        });
      }
    }
  }

  private handleSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
    this.dialogRef.close(true);
  }

  private handleError(error: any) {
    this.snackBar.open('Failed to submit response', 'Close', {
      duration: 3000
    });
    console.error('Error submitting response:', error);
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
