import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InquiryService } from '../inquiry.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrl: './ask-question.component.scss'
})
export class AskQuestionComponent {
  @Output() questionSubmitted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inquiryService: InquiryService
  ) {
    this.questionForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  onSubmit() {
    if (this.questionForm.valid) {
      this.inquiryService.askQuestion(this.questionForm.value).subscribe({
        next: () => {
          this.questionSubmitted.emit();
          this.questionForm.reset();
        },
        error: (error) => console.error('Failed to submit question:', error)
      });
    }
  }

  onCancel() {
    this.cancelled.emit();
    this.questionForm.reset();
  }
}
