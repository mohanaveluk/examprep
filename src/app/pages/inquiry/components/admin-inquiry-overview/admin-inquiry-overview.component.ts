import { Component } from '@angular/core';
import { FollowUp, InquiryService, Question, Response } from '../../inquiry.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdminResponseDialogComponent } from '../admin-response-dialog/admin-response-dialog.component';

interface QuestionsBySubject {
  [subject: string]: Question[];
}

@Component({
  selector: 'app-admin-inquiry-overview',
  templateUrl: './admin-inquiry-overview.component.html',
  styleUrl: './admin-inquiry-overview.component.scss'
})
export class AdminInquiryOverviewComponent {
  questions: Question[] = [];
  subjects: string[] = [];
  selectedSubject: string = '';
  filteredQuestionsBySubject: QuestionsBySubject = {};
  
  totalQuestions: number = 0;
  pendingResponses: number = 0;
  pendingFollowUps: number = 0;

  constructor(
    private inquiryService: InquiryService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.inquiryService.getQuestions().subscribe((questions: any) => {
      this.questions = questions.data;
      this.processQuestions();
    });
  }

  private processQuestions() {
    // Reset counters
    this.totalQuestions = this.questions.length;
    this.pendingResponses = 0;
    this.pendingFollowUps = 0;

    // Group questions by subject
    this.filteredQuestionsBySubject = this.questions.reduce((acc, question) => {
      const subject = question.subject;
      if (!acc[subject]) {
        acc[subject] = [];
      }
      acc[subject].push(question);
      return acc;
    }, {} as QuestionsBySubject);

    // Update subjects list
    this.subjects = Object.keys(this.filteredQuestionsBySubject);

    // Calculate pending counts
    this.questions.forEach(question => {
      if (question.status === 'pending') {
        this.pendingResponses++;
      }
      
      question.responses?.forEach(response => {
        response.followUps?.forEach(followUp => {
          if (!followUp.responses?.length) {
            this.pendingFollowUps++;
          }
        });
      });
    });

    // Select first subject if none selected
    if (!this.selectedSubject && this.subjects.length > 0) {
      this.selectSubject(this.subjects[0]);
    }
  }

  selectSubject(subject: string) {
    this.selectedSubject = subject;
  }

  getSubjectPendingCount(subject: string): number {
    return this.filteredQuestionsBySubject[subject]?.reduce((count, question) => {
      const hasPendingFollowUp = this.hasPendingFollowUp(question);
      return count + (hasPendingFollowUp ? 1 : 0);
    }, 0) || 0;
  }

  hasPendingFollowUp(question: Question): boolean {
    return question.responses?.some(response => 
      this.hasPendingFollowUpInResponse(response)
    ) || false;
  }

  hasPendingFollowUpInResponse(response: Response): boolean {
    return response.followUps?.some(followUp => 
      !followUp.responses?.length
    ) || false;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  getStatusColor(status: string): string {
    return status === 'answered' ? 'answered-chip' : 'pending-chip';
  }

  openResponseDialog(question: Question, followUp?: FollowUp) {
    const dialogRef = this.dialog.open(AdminResponseDialogComponent, {
      data: { question, followUp },
      width: '800px',
      maxHeight: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadQuestions();
      }
    });
  }
}
