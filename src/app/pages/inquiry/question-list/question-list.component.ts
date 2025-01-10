import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Question } from '../inquiry.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.scss'
})
export class QuestionListComponent {
  @Input() questions: Question[] = [];
  @Output() questionSelected = new EventEmitter<void>();

  constructor(private router: Router) {}

  getStatusColor(status: string): string {
    return status === 'answered' ? 'primary' : 'warn';
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

  viewQuestion(questionId: string) {
    this.router.navigate(['/inquiry/list', questionId]);
    this.questionSelected.emit();
  }

  createFirstInquiry() {
    this.router.navigate(['/inquiry/list'], { 
      queryParams: { showAskQuestion: true } 
    });
  }
}
