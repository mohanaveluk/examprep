import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InquiryService, Question, FollowUp } from '../../inquiry.service';
import { AdminResponseDialogComponent } from '../admin-response-dialog/admin-response-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface QuestionsBySubject {
  [subject: string]: Question[];
}

@Component({
  selector: 'app-admin-inquiry-dashboard',
  templateUrl: './admin-inquiry-dashboard.component.html',
  styleUrls: ['./admin-inquiry-dashboard.component.scss']
})
export class AdminInquiryDashboardComponent implements OnInit {
  questionsBySubject: QuestionsBySubject = {};
  filteredQuestionsBySubject: QuestionsBySubject = {};
  subjects: string[] = [];
  selectedSubject: string | null = null;
  loading = true;
  selectedFilter: any = null;
  stats = {
    total: 0,
    pending: 0,
    answered: 0
  };

  constructor(
    private inquiryService: InquiryService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.loading = true;
    this.inquiryService.getQuestions().subscribe({
      next: (questions:any) => {
        this.organizeQuestionsBySubject(questions.data);
        this.calculateStats(questions.data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load questions:', error);
        this.loading = false;
      }
    });
  }

  private organizeQuestionsBySubject(questions: Question[]) {
    this.questionsBySubject = questions.reduce((acc, question) => {
      if (!acc[question.subject]) {
        acc[question.subject] = [];
      }
      acc[question.subject].push(question);
      return acc;
    }, {} as QuestionsBySubject);

    this.filteredQuestionsBySubject = this.questionsBySubject;
    this.subjects = Object.keys(this.questionsBySubject).sort();
    if (this.subjects.length && !this.selectedSubject) {
      this.selectedSubject = this.subjects[0];
    }
  }

  private calculateStats(questions: Question[]) {
    this.stats = questions.reduce((acc, question) => ({
      total: acc.total + 1,
      pending: acc.pending + (question.status === 'pending' ? 1 : 0),
      answered: acc.answered + (question.status === 'answered' ? 1 : 0)
    }), { total: 0, pending: 0, answered: 0 });
  }

  selectSubject(subject: string) {
    this.selectedSubject = subject;
  }

  viewQuestionDetail(questionId: string) {
    this.router.navigate(['/inquiry/list', questionId]);
  }

  openResponseDialog(question: Question, followUp?: FollowUp) {
    const dialogRef = this.dialog.open(AdminResponseDialogComponent, {
      data: {question, followUp},
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
  
  getStatusColor(status: string): string {
    return status === 'answered' ? 'answered-chip' : 'pending-chip';
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

  applyFilter(filter: string) {
    this.selectedSubject = null;
    this.filteredQuestionsBySubject = {};
    this.subjects = [];
    if (filter !== 'all') {
      // for (const subject in this.questionsBySubject) {
      //   this.filteredQuestionsBySubject[subject] = this.questionsBySubject[subject].filter(question => question.status === status);
      // }
      for (const subject in this.questionsBySubject) {
        const pendingQuestions = this.questionsBySubject[subject].filter(question => question.status === filter);
        if (pendingQuestions.length > 0) {
          this.filteredQuestionsBySubject[subject] = pendingQuestions;
        }
      }
    }
    else {
      this.filteredQuestionsBySubject = this.questionsBySubject;
    }
    this.subjects = Object.keys(this.filteredQuestionsBySubject).sort();
    if (this.subjects.length && !this.selectedSubject) {
      this.selectedSubject = this.subjects[0];
    }
  }

  

}