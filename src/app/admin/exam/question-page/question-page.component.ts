import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

interface Option {
  text: string;
  correct: boolean;
}

interface Question {
  text: string;
  type: string;
  options: Option[];
  correctOption?: number;
}

@Component({
  selector: 'app-question-page',
  templateUrl: './question-page.component.html',
  styleUrl: './question-page.component.scss'
})
export class QuestionPageComponent {
  @ViewChild('viewQuestionDialog') public viewQuestionDialog?: TemplateRef<any>;

  
  questionForm: FormGroup;
  questions: Question[] = [];
  viewingQuestion: any = null;
  displayedColumns: string[] = ['text', 'type', 'actions'];

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.questionForm = this.fb.group({
      text: ['', Validators.required],
      type: ['single', Validators.required],
      options: this.fb.array([this.createOption()]),
      correctOption: [null]
    });
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  createOption(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      correct: [false]
    });
  }

  addOption() {
    if (this.options.length < 5) {
      this.options.push(this.createOption());
    }
  }

  removeOption(index: number) {
    this.options.removeAt(index);
  }

  addQuestion() {
    const question: Question = this.questionForm.value;
    if (question.type === 'single') {
      question.options.forEach((option, index) => {
        option.correct = index === question.correctOption;
      });
    }
    this.questions.push(question);
    this.resetQuestionForm();
  }

  editQuestion(index: number) {
    const question = this.questions[index];
    this.questionForm.patchValue(question);
    this.questions.splice(index, 1);
  }

  viewQuestion(question: Question) {
    // this.viewingQuestion = question;
    // this.dialog.open(this.viewQuestionDialog, {
    //   data: question
    // });
  }

  closeModal() {
    this.viewingQuestion = null;
  }

  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  resetQuestionForm() {
    this.questionForm.reset({
      text: '',
      type: 'single',
      options: this.fb.array([this.createOption()])
    });
  }
}

@Component({
  selector: 'view-question-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.text }}</h2>
    <mat-dialog-content>
      <p>Type: {{ data.type }}</p>
      <ul>
        <li *ngFor="let option of data.options">
          {{ option.text }} <span *ngIf="option.correct">(Correct)</span>
        </li>
      </ul>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="close()">Close</button>
    </mat-dialog-actions>
  `
})
export class ViewQuestionDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ViewQuestionDialog>) {}

  close() {
    this.dialogRef.close();
  }
}