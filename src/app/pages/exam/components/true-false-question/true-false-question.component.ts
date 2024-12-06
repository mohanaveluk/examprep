import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { RandomQuestionResponse } from '../../../models/exam.model';


@Component({
  selector: 'app-true-false-question',
  templateUrl: './true-false-question.component.html',
  styleUrls: ['./true-false-question.component.scss']
})
export class TrueFalseQuestionComponent implements OnInit, OnChanges{
  @Input() question!: RandomQuestionResponse;
  @Input() selectedAnswer?: number;
  @Output() answerChange = new EventEmitter<number>();

  ngOnInit() {
    this.initializeSelectedAnswer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedAnswer']) {
      this.initializeSelectedAnswer();
    }
  }

  onAnswerSelect(optionId: number) {
    this.selectedAnswer = optionId;
    this.answerChange.emit(optionId);
  }

  private initializeSelectedAnswer() {
    if (this.selectedAnswer !== undefined && this.question?.options) {
      const option = this.question.options.find(opt => opt.id === this.selectedAnswer);
      if (option) {
        this.onAnswerSelect(option.id);
      }
    }
  }
}