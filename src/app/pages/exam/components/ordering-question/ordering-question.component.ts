import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OptionResponse, RandomQuestionResponse } from '../../../models/exam.model';

@Component({
  selector: 'app-ordering-question',
  templateUrl: './ordering-question.component.html',
  styleUrls: ['./ordering-question.component.scss']
})
export class OrderingQuestionComponent {
  @Input() question!: RandomQuestionResponse;
  @Input() selectedAnswer?: number[];
  @Output() answerChange = new EventEmitter<number[]>();

  orderedOptions: OptionResponse[] = [];
  
  ngOnInit() {
    this.orderedOptions = [...this.question.options];
    if (this.selectedAnswer) {
      this.orderedOptions = this.selectedAnswer.map(id => 
        this.question.options.find(opt => opt.id === id)!
      );
    }
  }

  drop(event: CdkDragDrop<OptionResponse>) {
    moveItemInArray(this.orderedOptions, event.previousIndex, event.currentIndex);
    this.answerChange.emit(this.orderedOptions.map(opt => opt.id));
  }
}