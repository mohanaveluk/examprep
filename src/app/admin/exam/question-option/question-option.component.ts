import { Component, OnInit, ViewChild } from '@angular/core';
import { Question } from '../models/question.model';
import { QuestionViewDialogComponent } from '../question-view-dialog/question-view-dialog.component';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionService } from '../services/question.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { HeaderService } from '../../services/header.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-question-option',
  templateUrl: './question-option.component.html',
  styleUrl: './question-option.component.scss'
})
export class QuestionOptionComponent  implements OnInit {
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;

  questionForm: FormGroup;
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  displayedColumns: string[] = ['question', 'type', 'actions'];
  currentEditId: number | null = null;
  loading = false;
  isSubmitted = false;
  searchQuery = '';

  constructor(
    private headerService: HeaderService,
    public fb: FormBuilder,
    private dialog: MatDialog,
    private questionService: QuestionService,
    private snackBar: MatSnackBar
  ) {
    this.questionForm = this.createForm();
    this.setupFormValidation();
  }

  ngOnInit(): void {
    this.headerService.setTitle("Admin - Exam");
    //this.setupTypeChangeListener();
    this.questionForm.get('type')?.valueChanges.subscribe(type => {
      this.resetOptions(type);
    });
    
    this.loadQuestions();
    this.questionForm.patchValue({
      type: 'single'
    });
    this.filteredQuestions = [
      {
        id: 1,
        type: 'single',
        question: 'Which of the following is a function of the respiratory system?',
        options: ['Gas exchange', 'pH regulation', 'Heat production', 'Blood filtration', 'Voice production'],
        correctAnswers: [4],
        isDeleted: false

      },
      {
        id: 2,
        type: 'single',
        question: 'The human heart has how many chambers?',
        options: ['Two', 'Three', 'Four', 'Five'],
        correctAnswers: [1],
        isDeleted: false

      },
      {
        id: 3,
        type: 'multiple',
        question: 'Select the correct components of the cell membrane:',
        options: ['Phospholipids', 'Proteins', 'Nucleic acids', 'Glucose', 'Cholesterol'],
        correctAnswers: [1,2,4],
        isDeleted: false

      },
    ]
    this,this.questions = this.filteredQuestions;
  }

  setupTypeChangeListener(): void {
    this.questionForm.get('type')?.valueChanges.subscribe(type => {
      if (type === 'true-false') {
        this.resetOptionsForTrueFalse();
      } else {
        this.resetOptionsForChoices();
      }
      this.correctAnswers.clear();
    });
  }

  resetOptionsForTrueFalse(): void {
    const optionsArray = this.questionForm.get('options') as FormArray;
    optionsArray.clear();
    optionsArray.push(this.fb.control('True'));
    optionsArray.push(this.fb.control('False'));
  }

  resetOptionsForChoices(): void {
    const optionsArray = this.questionForm.get('options') as FormArray;
    optionsArray.clear();
    for (let i = 0; i < 4; i++) {
      optionsArray.push(this.fb.control('', Validators.required));
    }
    optionsArray.push(this.fb.control(''));
  }


  resetOptions(type: string): void {
    const optionsArray = this.questionForm.get('options') as FormArray;
    optionsArray.clear();
    const correctAnswersArray = this.questionForm.get('correctAnswers') as FormArray;
    // while (optionsArray.length) {
    //   optionsArray.removeAt(0);
    // }
    while (correctAnswersArray.length) {
      correctAnswersArray.removeAt(0);
    }

    if (type === 'true-false') {
      optionsArray.push(this.fb.control('True', Validators.required));
      optionsArray.push(this.fb.control('False', Validators.required));
    } else if (type === 'ranking') {
      for (let i = 0; i < 4; i++) {
        optionsArray.push(this.fb.control('', Validators.required));
      }
      optionsArray.push(this.fb.control(''));
      // For ranking, correctAnswers will store the correct order (0-4)
      const correctAnswersArray = this.questionForm.get('correctAnswers') as FormArray;
      [0, 1, 2, 3, 4].forEach(index => {
        correctAnswersArray.push(this.fb.control(index));
      });
    } else {
      for (let i = 0; i < 4; i++) {
        optionsArray.push(this.fb.control('', Validators.required));
      }
      optionsArray.push(this.fb.control(''));
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    const correctAnswers = this.questionForm.get('correctAnswers') as FormArray;
    moveItemInArray(correctAnswers.controls, event.previousIndex, event.currentIndex);
    correctAnswers.updateValueAndValidity();
  }

  updateOrder(optionIndex: number, newOrder: number): void {
    const correctAnswers = this.questionForm.get('correctAnswers') as FormArray;
    const currentOrder = correctAnswers.value;
    
    // Find the index that currently has the new order value
    const swapIndex = currentOrder.indexOf(newOrder - 1);
    
    // Swap the values
    if (swapIndex !== -1) {
      const temp = currentOrder[optionIndex];
      currentOrder[optionIndex] = currentOrder[swapIndex];
      currentOrder[swapIndex] = temp;
      
      // Update the form array
      correctAnswers.patchValue(currentOrder);
    }
  }
  
  loadQuestions(): void {
    this.loading = true;
    this.questionService.getQuestions()
      .subscribe({
        next: (questions) => {
          this.questions = questions;
          this.updateFilteredQuestions();
          this.loading = false;
        },
        error: (error) => {
          this.showError('Failed to load questions');
          this.loading = false;
        }
      });
  }

  createForm(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      type: ['single', Validators.required],
      options: this.fb.array([
        this.fb.control('', [Validators.required, Validators.minLength(5)]),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('')
      ]),
      correctAnswers: this.fb.array([], [Validators.required])
    });
  }


  setupFormValidation(): void {
    this.questionForm.get('type')?.valueChanges.subscribe(type => {
      const correctAnswers = this.questionForm.get('correctAnswers') as FormArray;
      if (type === 'single') {
        correctAnswers.setValidators([Validators.required, this.exactLengthValidator(1)]);
      } else {
        correctAnswers.setValidators([Validators.required, this.minLengthValidator(2)]);
      }
      correctAnswers.updateValueAndValidity();
    });
  }

  exactLengthValidator(length: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return Array.isArray(value) && value.length === length ? null : { exactLength: true };
    };
  }

  minLengthValidator(minLength: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return Array.isArray(value) && value.length >= minLength ? null : { minLength: true };
    };
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  get correctAnswers(): FormArray {
    return this.questionForm.get('correctAnswers') as FormArray;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      const questionData = {
        question: formValue.question,
        type: formValue.type,
        options: formValue.type === 'true-false' 
          ? ['True', 'False']
          : formValue.options.filter((option: string) => option.trim() !== ''),
        correctAnswers: formValue.correctAnswers
      };

      this.loading = true;

      if (this.currentEditId) {
        this.questionService.updateQuestion(this.currentEditId, questionData)
          .subscribe({
            next: (updatedQuestion) => {
              const index = this.questions.findIndex(q => q.id === this.currentEditId);
              if (index !== -1) {
                this.questions[index] = updatedQuestion;
                this.updateFilteredQuestions();
              }
              this.resetForm();
              this.showSuccess('Question updated successfully');
              this.expansionPanel.close();
            },
            error: (error) => this.showError('Failed to update question'),
            complete: () => this.loading = false
          });
      } else {
        this.questionService.createQuestion(questionData)
          .subscribe({
            next: (newQuestion) => {
              this.questions.push(newQuestion);
              this.updateFilteredQuestions();
              this.resetForm();
              this.showSuccess('Question created successfully');
              this.expansionPanel.close();
            },
            error: (error) => this.showError('Failed to create question'),
            complete: () => this.loading = false
          });
      }
      
    }
    else {
      this.showError('Please fill in all required fields correctly');
    }
  }

  private resetForm(): void {
    this.currentEditId = null;
    this.questionForm.reset();
    // Set default values after reset
    this.questionForm.patchValue({
      type: 'single',
      options: ['', '', '', '', ''],
      correctAnswers: []
    });
    // Clear validators errors
    Object.keys(this.questionForm.controls).forEach(key => {
      const control = this.questionForm.get(key);
      control?.markAsUntouched();
      control?.updateValueAndValidity();
    });
  }

  editQuestion(question: Question): void {
    this.currentEditId = question.id;
    this.isSubmitted = false;
    // Reset form first to clear any previous state
    this.questionForm.reset();
    // Then patch all values including type
    this.questionForm.patchValue({
      question: question.question,
      type: question.type,
      //options: [...question.options, ...Array(5 - question.options.length).fill('')],
    });

    // Reset options based on question type
    if (question.type === 'true-false') {
      this.resetOptionsForTrueFalse();
    }
    else{
      const optionsArray = this.questionForm.get('options') as FormArray;
      optionsArray.clear();
      question.options.forEach(option => {
        optionsArray.push(this.fb.control(option));
      });
      // Fill remaining slots with empty strings if needed
      while (optionsArray.length < 5) {
        optionsArray.push(this.fb.control('', Validators.required));
      }

    }

     // Clear existing correct answers array
     while (this.correctAnswers.length) {
      this.correctAnswers.removeAt(0);
    }
    
    // Add correct answers to the form array
    question.correctAnswers.forEach(index => {
      this.correctAnswers.push(this.fb.control(index));
    });

    this.expansionPanel.open();
  }

  cancelEdit(): void {
    this.currentEditId = null;
    this.isSubmitted = false;
    this.questionForm.reset({
      type: 'single',
      options: ['', '', '', '', ''],
      correctAnswers: []
    });
    this.expansionPanel.close();
  }


  deleteQuestion(id: number): void {
    this.loading = true;
    this.questionService.deleteQuestion(id)
      .subscribe({
        next: () => {
          this.questions = this.questions.filter(q => q.id !== id);
          this.updateFilteredQuestions();
          this.showSuccess('Question deleted successfully');
        },
        error: (error: any) => this.showError('Failed to delete question'),
        complete: () => this.loading = false
      });
  }

  viewQuestion(question: Question): void {
    this.dialog.open(QuestionViewDialogComponent, {
      width: '900px',
      data: question
    });
  }

  private resetForm1(): void {
    this.currentEditId = null;
    this.questionForm.reset({
      type: 'single-choice',
      options: ['', '', '', '', ''],
      correctAnswers: []
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  /** */
  updateFilteredQuestions(): void {
    this.filteredQuestions = this.questions
      .filter(q => !q.isDeleted)
      .filter(q => 
        this.searchQuery ? 
        q.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        q.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        q.options.some(opt => opt.toLowerCase().includes(this.searchQuery.toLowerCase()))
        : true
      );
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.updateFilteredQuestions();
  }
  /** */
}
