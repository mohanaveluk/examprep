import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrialQuestionService } from '../../services/trial-question.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

interface QuestionType {
  value: string;
  label: string;
}

@Component({
  selector: 'app-trial-question-dialog',
  templateUrl: './trial-question-dialog.component.html',
  styleUrl: './trial-question-dialog.component.scss'
})
export class TrialQuestionDialogComponent {
  questionForm!: FormGroup;
  isEditing: boolean;
  questionDetail: any;


  questionTypes = [
    { value: 'single', label: 'Single Choice' },
    { value: 'multiple', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' }
  ];

  constructor(
    private fb: FormBuilder,
    private trialQuestionService: TrialQuestionService,
    private dialogRef: MatDialogRef<TrialQuestionDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditing = !!data.question;
    this.initForm();
    if (this.isEditing) {
      this.patchForm(data.question);
    }
  }

  private initForm(): void {
    this.questionForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(10)]],
      type: ['single', Validators.required],
      maxSelections: [1],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      explanation: ['', [Validators.required, Validators.minLength(10)]],
      options: this.fb.array([])
    });

    // Add initial options for new questions
    if (!this.isEditing) {
      this.addOption();
      this.addOption();
      this.addOption();
      this.addOption();
    }
  }

  patchFormWithQuestion(question: any): void {
    this.questionForm.patchValue({
      text: question.text,
      type: question.type,
      maxSelections: question.maxSelections,
      subject: question.subject,
      explanation: question.explanation
    });

    question.options.forEach((option: { text: any; isCorrect: any; }) => {
      this.options.push(this.fb.group({
        text: [option.text, Validators.required],
        isCorrect: [option.isCorrect]
      }));
    });
  }

  private patchForm(question: any): void {
    this.trialQuestionService.getQuestionByExamId(this.data.examId, question.id).subscribe({
      next: (questions: any) => {
        this.questionDetail = questions.data;
        this.questionForm.patchValue({
          text: question.text,
          type: question.type,
          maxSelections: question.maxSelections,
          subject: question.subject,
          explanation: question.explanation
        });

        const optionsArray = this.questionForm.get('options') as FormArray;
        this.questionDetail.options.forEach((option: any) => {
          optionsArray.push(this.createOptionGroup(option));
        });
      },
      error: (error: any) => {
        console.error('Error loading question:', error);
        this.snackBar.open('Failed to load question', 'Close', { duration: 3000 });
      }
    });
  }

  
  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  createOptionGroup(option: any = { text: '', isCorrect: false }): FormGroup {
    return this.fb.group({
      text: [option.text, Validators.required],
      isCorrect: [option.isCorrect]
    });
  }

  addOption(): void {
    if (this.options.length < 5) {
      this.options.push(this.createOptionGroup());
    }
  }

  addOption1(): void {
    if (this.options.length < 5) {
      this.options.push(this.fb.group({
        text: ['', Validators.required],
        isCorrect: [false]
      }));
    }
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  onTypeChange(type: string): void {
    const maxSelections = type === 'multiple' ? 2 : 1;
    this.questionForm.patchValue({ maxSelections });
    
    if (type === 'true-false') {
      this.options.clear();
      this.options.push(this.fb.group({ text: 'True', isCorrect: [false] }));
      this.options.push(this.fb.group({ text: 'False', isCorrect: [false] }));
    }
  }

  private setupTrueFalseOptions(): void {
    // Clear existing options
    while (this.options.length) {
      this.options.removeAt(0);
    }

    // Add True/False options
    this.options.push(this.createOptionGroup({ text: 'True', isCorrect: false }));
    this.options.push(this.createOptionGroup({ text: 'False', isCorrect: false }));
  }

  onSingleOptionSelect(selectedOption: any): void {
    this.options.controls.forEach(control => {
      control.get('isCorrect')?.setValue(control === selectedOption);
    });
  }

  onMultipleOptionSelect(option: any, checked: boolean): void {
    const selectedCount = this.options.controls.filter(
      control => control.get('isCorrect')?.value
    ).length;

    const maxSelections = this.questionForm.get('maxSelections')?.value || 1;

    if (checked && selectedCount >= maxSelections) {
      option.get('isCorrect')?.setValue(false);
      this.snackBar.open(
        `Maximum ${maxSelections} options can be selected`,
        'Close',
        { duration: 3000 }
      );
      return;
    }

    option.get('isCorrect')?.setValue(checked);
  }
  
  onSubmit(): void {
    if (this.questionForm.valid) {
      const questionData = {
        ...this.questionForm.value,
        examId: this.data.examId
      };

      const request$ = this.isEditing ?
        this.trialQuestionService.updateQuestion(this.data.question.id, questionData) :
        this.trialQuestionService.createQuestion(questionData);

      request$.subscribe({
        next: () => {
          this.snackBar.open(
            `Question ${this.isEditing ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error saving question:', error);
          this.snackBar.open('Failed to save question', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
