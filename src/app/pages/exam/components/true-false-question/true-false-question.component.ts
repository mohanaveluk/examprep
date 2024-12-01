import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RandomQuestionResponse } from '../../../models/exam.model';


@Component({
  selector: 'app-true-false-question',
  templateUrl: './true-false-question.component.html',
  styleUrls: ['./true-false-question.component.scss']
})
export class TrueFalseQuestionComponent {
  @Input() question!: RandomQuestionResponse;
  @Input() selectedAnswer?: any;
  @Output() answerChange = new EventEmitter<number>();

  onAnswerSelect(optionId: number) {
    this.answerChange.emit(optionId);
  }
}