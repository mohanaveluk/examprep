import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-question-edit-dialog',
  templateUrl: './question-edit-dialog.component.html',
  styleUrl: './question-edit-dialog.component.scss'
})
export class QuestionEditDialogComponent {
  questionForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<QuestionEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { question?: Question }
  ) {
    this.questionForm = this.createForm();
    if (data.question) {
      this.questionForm.patchValue({
        question: data.question.question,
        type: data.question.type,
        options: [...data.question.options, ...Array(5 - data.question.options.length).fill('')],
        correctAnswers: data.question.correctAnswers
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      type: ['single-choice', Validators.required],
      options: this.fb.array([
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control('')
      ]),
      correctAnswers: this.fb.array([])
    });
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  get correctAnswers(): FormArray {
    return this.questionForm.get('correctAnswers') as FormArray;
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      const questionData = {
        question: formValue.question,
        type: formValue.type,
        options: formValue.options.filter((option: string) => option.trim() !== ''),
        correctAnswers: formValue.correctAnswers
      };
      this.dialogRef.close(questionData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
