import { Component, Inject, OnInit } from '@angular/core';
import { TrialQuestionDialogComponent } from '../trial-question-dialog/trial-question-dialog.component';
import { TrialQuestionService } from '../../services/trial-question.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-trial-question',
  templateUrl: './trial-question.component.html',
  styleUrl: './trial-question.component.scss'
})
export class TrialQuestionComponent implements OnInit{
  questions: any[] = [];
  displayedColumns: string[] = ['number', 'text', 'type', 'subject', 'explanation', 'actions']; //'options',

  constructor(
    private trialQuestionService: TrialQuestionService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<TrialQuestionComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { examId: string }
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.trialQuestionService.getQuestionsByExamId(this.data.examId).subscribe({
      next: (questions: any) => {
        this.questions = questions.data;
      },
      error: (error: any) => {
        console.error('Error loading questions:', error);
        this.snackBar.open('Failed to load questions', 'Close', { duration: 3000 });
      }
    });
  }

  addQuestion(): void {
    const dialogRef = this.dialog.open(TrialQuestionDialogComponent, {
      width: '900px',
      data: { examId: this.data.examId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadQuestions();
      }
    });
  }

  editQuestion(question: any): void {
    const dialogRef = this.dialog.open(TrialQuestionDialogComponent, {
      width: '900px',
      data: { 
        examId: this.data.examId,
        question: question
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadQuestions();
      }
    });
  }

  getOptionsList(options: any[]): string {
    return options.map(opt => opt.text).join(', ');
  }

  getQuestionType(type: string): string {
    const types = {
      single: 'Single Choice',
      multiple: 'Multiple Choice',
      "true-false": 'True/False'
    };
    return type;
  }

  deleteQuestion(question: any): void {
    if (confirm(`Are you sure you want to delete "${question.text}"?`)) {
      this.trialQuestionService.deleteQuestion(this.data.examId, question.id).subscribe(success => {
        if (success) {
          this.loadQuestions();
        }
      });
    }
  }


}
