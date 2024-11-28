import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Question, QuestionResponse } from '../models/question.model';
import { QuestionService } from '../services/question.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-question-view-dialog',
  templateUrl: './question-view-dialog.component.html',
  styleUrl: './question-view-dialog.component.scss',
})
export class QuestionViewDialogComponent  implements OnInit {
  loading = false;
  question!: QuestionResponse;

  constructor(
    public dialogRef: MatDialogRef<QuestionViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Question,
    private questionService: QuestionService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadQuestion(this.data?.qguid!);
  }

  loadQuestion(qguid: string): void {
    this.loading = true;
    this.questionService.getQuestion(qguid)
      .subscribe({
        next: (question: any) => {
          if(question.success){
            this.question = question?.data;
            this.question.correctAnswers = this.question.correctAnswers.map((answer: any) => parseInt(answer, 10));
            this.question.order = this.question?.order?.map((answer: any) => parseInt(answer, 10));
          }
          this.loading = false;
        },
        error: (error) => {
          this.showError(error?.message);
          this.loading = false;
        }
      });
  }


  close(): void {
    this.dialogRef.close();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

}
