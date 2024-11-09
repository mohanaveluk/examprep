import { Component } from '@angular/core';
import { InquiryService, Question, Stats } from '../inquiry.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inquiry-dashboard',
  templateUrl: './inquiry-dashboard.component.html',
  styleUrl: './inquiry-dashboard.component.scss'
})
export class InquiryDashboardComponent {
  stats: Stats | null = null;
  questions: Question[] = [];
  showAskQuestion = false;
  filteredQuestions: Question[] = []; // Filtered list of questions to display
  selectedFilter: any = null;

  // Define filter options
  filters = [
    { label: 'All Questions', value: 'all' },
    { label: 'Today\'s Questions', value: 'today' },
    { label: 'This Month\'s Questions', value: 'thisMonth' },
    { label: 'Last Month\'s Questions', value: 'lastMonth' },
    { label: 'Answered', value: 'answered' },
    { label: 'Pending', value: 'pending' }
  ];

  constructor(
    private inquiryService: InquiryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadQuestions();
    this.subscribeToNotifications();
  }

  private loadStats() {
    this.inquiryService.getStats().subscribe({
      next: (stats) => this.stats = stats,
      error: (error) => console.error('Failed to load stats:', error)
    });
  }

    // Filter function
    applyFilter(filter: string) {
      this.selectedFilter = filter;
      
      switch (filter) {
        case 'today':
          this.filteredQuestions = this.questions.filter(q => q.isToday);
          break;
        case 'thisMonth':
          this.filteredQuestions = this.questions.filter(q => q.isThisMonth);
          break;
        case 'lastMonth':
          this.filteredQuestions = this.questions.filter(q => q.isLastMonth);
          break;
        case 'answered':
          this.filteredQuestions = this.questions.filter(q => q.status === 'answered');
          break;
        case 'pending':
          this.filteredQuestions = this.questions.filter(q => q.status === 'pending');
          break;
        default:
          this.filteredQuestions = this.questions;
          break;
      }
    }

  loadQuestions() {
    this.inquiryService.getQuestions().subscribe({
      next: (questions) => {
        this.questions = this.filteredQuestions = questions;
      },
      error: (error) => console.error('Failed to load questions:', error)
    });
  }

  private subscribeToNotifications() {
    this.inquiryService.notifications$.subscribe(count => {
      if (count > 0) {
        this.snackBar.open(`You have ${count} new responses!`, 'View', {
          duration: 5000
        }).onAction().subscribe(() => {
          this.loadQuestions();
        });
      }
    });
  }

  onQuestionSubmitted() {
    this.showAskQuestion = false;
    this.loadQuestions();
    this.loadStats();
  }
}
