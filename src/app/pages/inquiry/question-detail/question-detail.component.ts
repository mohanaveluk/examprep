import { Component } from '@angular/core';
import { InquiryService, Question } from '../inquiry.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrl: './question-detail.component.scss'
})
export class QuestionDetailComponent {
  question: Question | null = null;
  responseForm: FormGroup;
  isAdmin = false; // This should be determined by your auth service
  followUpForm!: FormGroup;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inquiryService: InquiryService,
    private fb: FormBuilder
  ) {
    this.responseForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.followUpForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Mock admin status - in real app, get from auth service
    //this.isAdmin = true; // For demonstration purposes
  }

  ngOnInit() {
    const questionId = this.route.snapshot.params['id'];
    this.loadQuestion(questionId);
  }

  loadQuestion(id: string) {
    this.inquiryService.getQuestion(id).subscribe({
      next: (question: any) => {
        this.question = question.data;
        this.inquiryService.markAsRead(id).subscribe();
      },
      error: (error) => {
        console.error('Failed to load question:', error);
        this.router.navigate(['/inquiry/inquiries']);
      }
    });
  }

  onSubmitResponse() {
    if (this.responseForm.valid && this.question) {
      this.inquiryService.addResponse(
        this.question.id,
        this.responseForm.get('content')?.value
      ).subscribe({
        next: () => {
          this.responseForm.reset();
          this.loadQuestion(this.question!.id);
        },
        error: (error) => console.error('Failed to add response:', error)
      });
    }
  }

  onSubmitFollowUp(responseId: string) {
    if (this.followUpForm.valid) {
      const followUpDto = {
        content: this.followUpForm.get('content')?.value,
        responseId: responseId
      };

      this.inquiryService.addFollowUp(responseId, followUpDto).subscribe({
        next: () => {
          this.followUpForm.reset();
          this.loadQuestion(this.question!.id);
        },
        error: (error) => console.error('Failed to add follow-up:', error)
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

  backToList() {
    this.router.navigate(['/inquiry/list']);
  }
}
