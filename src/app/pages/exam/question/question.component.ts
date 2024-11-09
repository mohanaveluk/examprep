import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam, ExamService, Question } from '../exam.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent {
  examId: string = '';
  currentQuestion: Question | null = null;
  currentIndex: number = 0;
  totalQuestions: number = 0;
  selectedAnswers: { [key: number]: number | number[] } = {};
  exam: Exam | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit() {
    this.examId = this.route.snapshot.params['id'];
    this.loadExamDetails();
    this.loadQuestion();
  }

  loadExamDetails() {
    this.examService.getAvailableExams().subscribe({
      next: (exams) => {
        this.exam = exams.find(e => e.id === this.examId) || null;
      },
      error: (error) => console.error('Failed to load exam details:', error)
    });
  }

  loadQuestion() {
    this.examService.getQuestion(this.examId, this.currentIndex).subscribe({
      next: (data) => {
        this.currentQuestion = data.question;
        this.totalQuestions = data.totalQuestions;
      },
      error: (error) => console.error('Failed to load question:', error)
    });
  }

  onSingleAnswerChange(optionId: number) {
    this.selectedAnswers[this.currentIndex] = optionId;
  }

  onMultipleAnswerChange(optionId: number, checked: boolean) {
    const currentAnswers = (this.selectedAnswers[this.currentIndex] as number[]) || [];
    
    if (checked) {
      this.selectedAnswers[this.currentIndex] = [...currentAnswers, optionId];
    } else {
      this.selectedAnswers[this.currentIndex] = currentAnswers.filter(id => id !== optionId);
    }
  }

  isOptionSelected(optionId: number): boolean {
    const answer = this.selectedAnswers[this.currentIndex];
    if (Array.isArray(answer)) {
      return answer.includes(optionId);
    }
    return answer === optionId;
  }

  hasCurrentAnswer(): boolean {
    const currentAnswer = this.selectedAnswers[this.currentIndex];
    if (Array.isArray(currentAnswer)) {
      return currentAnswer.length > 0;
    }
    return currentAnswer !== undefined;
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.loadQuestion();
    }
  }

  next() {
    if (this.currentIndex < this.totalQuestions - 1) {
      this.currentIndex++;
      this.loadQuestion();
    }
  }

  submit() {
    const answersArray = Object.entries(this.selectedAnswers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId),
      answer
    }));

    this.examService.submitExam(this.examId, answersArray).subscribe({
      next: () => this.router.navigate(['/exam/summary', this.examId]),
      error: (error) => console.error('Failed to submit exam:', error)
    });
  }
}
