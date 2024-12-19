import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface SectionScore {
  name: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface TestSummary {
  examTitle: string;
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  sectionScores: SectionScore[];
  timeTaken: number;
}

@Component({
  selector: 'app-model-test-summary',
  templateUrl: './model-test-summary.component.html',
  styleUrl: './model-test-summary.component.scss'
})
export class ModelTestSummaryComponent implements OnInit {
  @Input() summary!: TestSummary;
  testTotalScore: string = ""
  constructor(private router: Router) {
    
  }
  ngOnInit(): void {
    this.testTotalScore = this.formatScore(this.summary?.totalScore);
  }

  get isPassing(): boolean {
    return this.summary.totalScore >= 50;
  }

  get scoreColor(): string {
    if (this.summary.totalScore >= 80) return 'success';
    if (this.summary.totalScore >= 50) return 'warning';
    return 'danger';
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  tryAgain(): void {
    // Navigate to start a new test
    this.router.navigate(['/exam/trial']);
  }

  viewPlans(): void {
    this.router.navigate(['/pricing/plans']);
  }

  formatScore(score: number): string {
    if (score % 1 === 0) {
      return score.toFixed(0);
    } else {
      return `${score.toFixed(2)}`;
    }
  }
}
