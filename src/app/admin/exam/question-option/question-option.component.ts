import { Component, OnInit, ViewChild } from '@angular/core';
import { Question } from '../models/question.model';
import { QuestionViewDialogComponent } from '../question-view-dialog/question-view-dialog.component';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionService } from '../services/question.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { HeaderService } from '../../services/header.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { FormManagementService } from '../../../shared/services/form-management.service';

@Component({
  selector: 'app-question-option',
  templateUrl: './question-option.component.html',
  styleUrl: './question-option.component.scss'
})
export class QuestionOptionComponent  implements OnInit {
  @ViewChild(MatExpansionPanel) expansionPanel!: MatExpansionPanel;

  examId: string="";
  questionForm: FormGroup;
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  displayedColumns: string[] = ['seqNo', 'question', 'type', 'actions'];
  currentEditId: number | null = null;
  qguid: string = "";
  loading = false;
  isSubmitted = false;
  searchQuery = '';

  constructor(
    private headerService: HeaderService,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private dialog: MatDialog,
    private questionService: QuestionService,
    private formManagementService: FormManagementService,
    private snackBar: MatSnackBar
  ) {
    this.questionForm = this.createForm();
    this.setupFormValidation();
  }



  get rankingOrder(): FormArray {
    return this.questionForm.get('rankingOrder') as FormArray;
  }

  

  ngOnInit(): void {
    this.headerService.setTitle("Admin - Exam");
    this.examId = this.route.snapshot.params['examId'];

    //this.setupTypeChangeListener();
    this.questionForm.get('type')?.valueChanges.subscribe(type => {
      this.resetOptions(type);
    });
    
    this.loadQuestions(this.examId);
    this.questionForm.patchValue({
      type: 'single'
    });
    /*this.filteredQuestions = [
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
    ]*/
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
    const rankingOrderArray = this.questionForm.get('rankingOrder') as FormArray;
    const optionsValues = optionsArray.controls.map(control => control.value);
    optionsArray.clear();
    rankingOrderArray.clear();

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
        rankingOrderArray.push(this.fb.control(i + 1)); // Initialize with default order

      }
      optionsArray.push(this.fb.control(''));
      rankingOrderArray.push(this.fb.control(5));

      // For ranking, correctAnswers will store the correct order (0-4)
      // const correctAnswersArray = this.questionForm.get('correctAnswers') as FormArray;
      // [0, 1, 2, 3, 4].forEach(index => {
      //   correctAnswersArray.push(this.fb.control(index));
      // });
    } else {
      if(this.currentEditId){
        for (let i = 0; i < 4; i++) {
          optionsArray.push(this.fb.control(optionsValues != null && optionsValues.length > 0? optionsValues[i] : '', Validators.required));
        }
        optionsArray.push(this.fb.control(optionsValues != null && optionsValues.length > 3? optionsValues[4] : ''));
 
      }else{
        for (let i = 0; i < 4; i++) {
          optionsArray.push(this.fb.control('', Validators.required));
        }
        optionsArray.push(this.fb.control(''));
      }
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    const correctAnswers = this.questionForm.get('correctAnswers') as FormArray;
    moveItemInArray(correctAnswers.controls, event.previousIndex, event.currentIndex);
    correctAnswers.updateValueAndValidity();
  }

  updateOrder1(optionIndex: number, newOrder: number): void {
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
  
  loadQuestions(examId: string): void {
    this.loading = true;
    this.questionService.getQuestions(examId)
      .subscribe({
        next: (questions: any) => {
          if(questions.success){
            this.questions = questions?.data?.questions ?? [];
            this.updateFilteredQuestions();
          }
          this.loading = false;
        },
        error: (error) => {
          this.showError('Failed to load questions');
          this.loading = false;
        }
      });
  }

  createForm1(): FormGroup {
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
      correctAnswers: this.fb.array([], [Validators.required]),
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      type: ['single', Validators.required],
      options: this.fb.array([]),
      correctAnswers: this.fb.array([]),
      rankingOrder: this.fb.array([]) // New FormArray for ranking order
    });
  }

  setupFormValidation(): void {
    this.questionForm.get('type')?.valueChanges.subscribe(type => {
      const correctAnswers = this.questionForm.get('correctAnswers') as FormArray;
      if (type === 'single' || type === 'true-false') {
        correctAnswers.setValidators([Validators.required, this.exactLengthValidator(1)]);
      } else if (type === 'multiple'){
        correctAnswers.setValidators([Validators.required, this.minLengthValidator(2)]);
      } else if (type === 'ranking'){
        correctAnswers.setValidators([]);
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

  onSubmit1(): void {
    this.isSubmitted = true;
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      const questionData = {
        qguid: this.qguid,
        question: formValue.question,
        type: formValue.type,
        options: formValue.type === 'true-false' 
          ? ['True', 'False']
          : formValue.options.filter((option: string) => option.trim() !== ''),
        correctAnswers: formValue.correctAnswers.map((answer: any) => answer+1),
        order: []
      };

      this.loading = true;

      if (this.currentEditId) {
        this.questionService.updateQuestion(this.examId, this.qguid, questionData)
          .subscribe({
            next: (updatedQuestion: any) => {
              const index = this.questions.findIndex(q => q.id === this.currentEditId);
              if (index !== -1) {
                this.questions[index] = {
                  id: updatedQuestion.data.id,
                  isDeleted: updatedQuestion.data.isDeleted,
                  qguid: updatedQuestion.data.qguid,
                  question: updatedQuestion.data.question,
                  type: updatedQuestion.data.type,
                  options: [],
                  correctAnswers: []
                };
                this.updateFilteredQuestions();
              }
              this.resetForm();
              this.showSuccess('Question updated successfully');
              this.expansionPanel.close();
            },
            error: (error) => this.showError(`Failed to update question - ${error.message}`),
            complete: () => this.loading = false
          });
      } else {
        this.questionService.createQuestion(this.examId, questionData)
          .subscribe({
            next: (newQuestion) => {
              this.questions.push(newQuestion);
              this.updateFilteredQuestions();
              this.resetForm();
              this.showSuccess('Question created successfully');
              this.expansionPanel.close();
            },
            error: (error) => this.showError(`Failed to create question - ${error.message}`),
            complete: () => this.loading = false
          });
      }
      
    }
    else {
      this.showError('Please fill in all required fields correctly');
    }
  }

  private resetForm2(): void {
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

  resetForm(): void {
    this.currentEditId = null;
    this.qguid = "";
    this.isSubmitted = false;
    this.resetOptions('single');
    this.questionForm.reset({
      question: this.fb.control('', Validators.required),
      type: 'single',
      //options: ['', '', '', '', ''],
      options: this.fb.array([
        this.fb.control('', [Validators.required, Validators.minLength(5)]),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('')
      ]),      
      correctAnswers: []      
    });
    // Mark all controls as untouched
    this.markFormGroupUntouched(this.questionForm);
    this.resetFormGroupValidation(this.questionForm);

  }

  editQuestion1(item: Question): void {
    this.qguid = item.qguid!;
    this.currentEditId = item.id;
    this.isSubmitted = false;
    // Reset form first to clear any previous state
    this.questionForm.reset();
    this.loading = true;

    this.questionService.getQuestion(this.qguid)
      .subscribe({
        next: (qresponse: any) => {
          if(qresponse.success){
            const fetchData = qresponse?.data;
            fetchData.correctAnswers = fetchData.correctAnswers.map((answer: any) => parseInt(answer, 10)-1);
            fetchData.order = fetchData?.order?.map((answer: any) => parseInt(answer, 10)-1);

            // Then patch all values including type
            this.questionForm.patchValue({
              question: fetchData.question,
              type: fetchData.type,
              //options: [...question.options, ...Array(5 - question.options.length).fill('')],
            });

            // Reset options based on question type
            if (fetchData.type === 'true-false') {
              this.resetOptionsForTrueFalse();
            }
            else{
              const optionsArray = this.questionForm.get('options') as FormArray;
              optionsArray.clear();
              fetchData.options.forEach((option: any) => {
                optionsArray.push(this.fb.control(option.text));
              });
              // Fill remaining slots with empty strings if needed
              while (optionsArray.length < 4) {
                optionsArray.push(this.fb.control('', Validators.required));
              }
              if (optionsArray.length === 4) {
                optionsArray.push(this.fb.control(''));
              }
            }

            // Clear existing correct answers array
            while (this.correctAnswers.length) {
              this.correctAnswers.removeAt(0);
            }
            
            // Add correct answers to the form array
            fetchData.correctAnswers.forEach((index: any) => {
              this.correctAnswers.push(this.fb.control(index));
            });


          }
          this.loading = false;
        },
        error: (error) => {
          this.showError(error?.message);
          this.loading = false;
        }
      });



    



    this.expansionPanel.open();
  }

  updateOrder(optionIndex: number, newPosition: number): void {
    const correctAnswers = this.questionForm.get('correctAnswers') as FormArray;
    const rankingOrderArray = this.questionForm.get('rankingOrder') as FormArray;
    const currentOrder = [...rankingOrderArray.value];
    
        // Find the option that currently has the new position
        const swapIndex = currentOrder.findIndex(pos => pos === newPosition);
        const oldPosition = currentOrder[optionIndex];
        
        // Swap the positions
        if (swapIndex !== -1) {
          currentOrder[swapIndex] = oldPosition;
        }
        currentOrder[optionIndex] = newPosition;
        
        // Update the form array
        while (rankingOrderArray.length) {
          rankingOrderArray.removeAt(0);
          correctAnswers.removeAt(0);
        }
        
        currentOrder.forEach(value => {
          rankingOrderArray.push(this.fb.control(value));
          //correctAnswers.push(this.fb.control(value));
        });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      let questionData: any = {
        qguid: this.qguid,
        question: formValue.question,
        type: formValue.type,
        options: formValue.options.filter((option: string) => option.trim() !== ''),
        correctAnswers: [],
        order: []
      };

      // Handle different question types
      if (formValue.type === 'ranking') {
        // For ranking questions, use the rankingOrder array
        questionData.order = formValue.rankingOrder;
        // Keep the original options order in correctAnswers
        //questionData.correctAnswers = Array.from({ length: formValue.options.length }, (_, i) => i + 1);

        //questionData.correctAnswers = formValue.correctAnswers.map((index: number) => index + 1);
        //questionData.order = formValue.correctAnswers.map((index: number) => index + 1);
      } else if (formValue.type === 'true-false') {
        questionData.options = ['True', 'False'];
        questionData.correctAnswers = formValue.correctAnswers.map((answer: number) => answer + 1);
      } else {
        // For single and multiple choice questions
        questionData.correctAnswers = formValue.correctAnswers.map((answer: number) => answer + 1);
      }

      this.loading = true;

      if (this.currentEditId) {
        this.questionService.updateQuestion(this.examId, this.qguid, questionData)
          .subscribe({
            next: (updatedQuestion: any) => {
              if (updatedQuestion.success) {
                const index = this.questions.findIndex(q => q.id === this.currentEditId);
                if (index !== -1) {
                  this.questions[index] = {
                    id: updatedQuestion.data.id,
                    isDeleted: updatedQuestion.data.isDeleted,
                    qguid: updatedQuestion.data.qguid,
                    question: updatedQuestion.data.question,
                    type: updatedQuestion.data.type,
                    options: updatedQuestion.data.options,
                    correctAnswers: updatedQuestion.data.correctAnswers,
                    order: updatedQuestion.data.order
                  };
                  this.updateFilteredQuestions();
                }
                this.resetForm();
                this.formManagementService.resetFormCompletely(this.questionForm);
                this.isSubmitted = false;
                this.showSuccess('Question updated successfully');
                this.currentEditId = null;
                this.expansionPanel.close();
              } else {
                this.showError('Failed to update question');
                this.isSubmitted = false;
              }
            },
            error: (error) => {
              this.showError(`Failed to update question - ${error.message}`);
              this.isSubmitted = false;
            },
            complete: () => this.loading = false
          });
      } else {
        this.questionService.createQuestion(this.examId, questionData)
          .subscribe({
            next: (newQuestion: any) => {
              if(newQuestion.success){
                this.questions.push(newQuestion.data);
                this.updateFilteredQuestions();
                this.completeFormReset();
                this.formManagementService.resetFormCompletely(this.questionForm);
                this.cancelEdit();
                this.showSuccess('Question created successfully');
                this.expansionPanel.close();
              }
              else{
                this.showError(`Failed to create question`);
                this.isSubmitted = false;
              }
            },
            error: (error) => {
              this.showError(`Failed to create question - ${error.message}`);
              this.isSubmitted = false;
            },
            complete: () => this.loading = false
          });
      }
    } else {
      this.showError('Please fill in all required fields correctly');
    }
  }

  completeFormReset(): void {
    this.currentEditId = null;
    this.qguid = "";
    this.isSubmitted = false;
    
    // Use the form management service to reset the form
    this.formManagementService.resetFormCompletely(this.questionForm);

    // Reset the form with initial values
    this.questionForm.patchValue({
      question: '',
      type: 'single'
    });
    
    // Reset options based on type
    this.resetOptions('single');
    
    // // Mark all form controls as pristine and untouched
    // Object.keys(this.questionForm.controls).forEach(key => {
    //   const control = this.questionForm.get(key);
    //   if (control) {
    //     control.markAsPristine();
    //     control.markAsUntouched();
    //     control.updateValueAndValidity();
    //   }
    // });
  }

  editQuestion2(item: Question): void {
    this.qguid = item.qguid!;
    this.currentEditId = item.id;
    this.isSubmitted = false;
    this.questionForm.reset();
    this.loading = true;

    this.questionService.getQuestion(this.qguid)
      .subscribe({
        next: (qresponse: any) => {
          if (qresponse.success) {
            const fetchData = qresponse?.data;
            
            // Convert correctAnswers to 0-based index
            const correctAnswers = fetchData.correctAnswers.map((answer: string) => parseInt(answer, 10) - 1);
            const order = fetchData.order?.map((answer: string) => parseInt(answer, 10) - 1) || [];

            // Set basic form values
            this.questionForm.patchValue({
              question: fetchData.question,
              type: fetchData.type,
            });

            // Handle options based on question type
            const optionsArray = this.questionForm.get('options') as FormArray;
            optionsArray.clear();

            if (fetchData.type === 'true-false') {
              optionsArray.push(this.fb.control('True'));
              optionsArray.push(this.fb.control('False'));
            } else {
              // Handle other question types
              fetchData.options.forEach((option: any) => {
                optionsArray.push(this.fb.control(option.text));
              });
              // Fill remaining slots if needed
              while (optionsArray.length < 4) {
                optionsArray.push(this.fb.control('', Validators.required));
              }
              if (optionsArray.length === 4) {
                optionsArray.push(this.fb.control(''));
              }
            }

            // Clear and set correct answers
            const correctAnswersArray = this.questionForm.get('correctAnswers') as FormArray;
            while (correctAnswersArray.length) {
              correctAnswersArray.removeAt(0);
            }

            if (fetchData.type === 'ranking') {
              // For ranking questions, use the order array if available, otherwise use correctAnswers
              const orderToUse = order.length > 0 ? order : correctAnswers;
              orderToUse.forEach((index: number) => {
                correctAnswersArray.push(this.fb.control(index));
              });
            } else {
              correctAnswers.forEach((index: number) => {
                correctAnswersArray.push(this.fb.control(index));
              });
            }
          }
          this.loading = false;
        },
        error: (error) => {
          this.showError(error?.message);
          this.loading = false;
        }
      });

    this.expansionPanel.open();
  }

  editQuestion(item: Question): void {
    this.qguid = item.qguid!;
    this.currentEditId = item.id;
    this.isSubmitted = false;
    this.questionForm.reset();
    this.loading = true;
    console.log(this.qguid);

    this.questionService.getQuestion(this.qguid)
      .subscribe({
        next: (qresponse: any) => {
          if (qresponse.success) {
            const fetchData = qresponse?.data;
            
            // Set basic form values
            this.questionForm.patchValue({
              question: fetchData.question,
              type: fetchData.type,
            });

            // Handle options based on question type
            const optionsArray = this.questionForm.get('options') as FormArray;
            const rankingOrderArray = this.questionForm.get('rankingOrder') as FormArray;
            optionsArray.clear();
            rankingOrderArray.clear();

            if (fetchData.type === 'ranking') {
              // Store original options order
              fetchData.options.forEach((option: any) => {
                optionsArray.push(this.fb.control(option.text));
              });

              // Set ranking order from the order property
              const order = fetchData.order?.map((answer: string) => parseInt(answer, 10)); // || Array.from({ length: fetchData.options.length }, (_, i) => i + 1);
              order.forEach((position: number) => {
                rankingOrderArray.push(this.fb.control(position));
              });
            } else if (fetchData.type === 'true-false') {
              optionsArray.push(this.fb.control('True'));
              optionsArray.push(this.fb.control('False'));
              
              // Set correct answers
              const correctAnswers = fetchData.correctAnswers.map((answer: string) => parseInt(answer, 10) - 1);
              const correctAnswersArray = this.questionForm.get('correctAnswers') as FormArray;
              correctAnswers.forEach((index: number) => {
                correctAnswersArray.push(this.fb.control(index));
              });
            } else {
              // Handle single/multiple choice
              fetchData.options.forEach((option: any, index: number) => {
                if(index < 4){
                  optionsArray.push(this.fb.control(option.text, Validators.required));
                }else{
                  optionsArray.push(this.fb.control(option.text));
                }
              });
              
              // Fill remaining slots if needed
              while (optionsArray.length < 4) {
                optionsArray.push(this.fb.control('', Validators.required));
              }
              if (optionsArray.length === 4) {
                optionsArray.push(this.fb.control(''));
              }

              // Set correct answers
              const correctAnswers = fetchData.correctAnswers.map((answer: string) => parseInt(answer, 10) - 1);
              const correctAnswersArray = this.questionForm.get('correctAnswers') as FormArray;
              correctAnswers.forEach((index: number) => {
                correctAnswersArray.push(this.fb.control(index));
              });
            }
            // Mark form as pristine and untouched after setting values
            this.questionForm.markAsPristine();
            this.questionForm.markAsUntouched();
          }
          this.loading = false;
        },
        error: (error) => {
          this.showError(error?.message);
          this.loading = false;
        }
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
    this.completeFormReset();
    this.expansionPanel.close();
    //this.markFormGroupUntouched(this.questionForm);
  }


  deleteQuestion(id: string): void {
    if (!confirm('Are you sure you want to delete this question?')) return;
    this.loading = true;
    this.questionService.deleteQuestion(this.examId, id)
      .subscribe({
        next: () => {
          this.questions = this.questions.filter(q => q.qguid !== id);
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
    if(!this.questions || this.questions.length <= 0) return;
    this.filteredQuestions = this.questions
      .filter(q => !q.isDeleted)
      .filter(q => 
        this.searchQuery ? 
        q.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        q.type.toLowerCase().includes(this.searchQuery.toLowerCase())
        //q.options.some(opt => opt.toLowerCase().includes(this.searchQuery.toLowerCase()))
        : true
      );
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.updateFilteredQuestions();
  }

  // Helper method to mark all controls as untouched
  private markFormGroupUntouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        control.markAsUntouched();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupUntouched(control);
      }
    });
  }


  // Helper method to reset validation state
  private resetFormGroupValidation(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.resetFormGroupValidation(control);
      }
    });
  }

  /** */
}
