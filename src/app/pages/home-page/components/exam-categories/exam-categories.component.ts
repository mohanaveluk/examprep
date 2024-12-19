import { Component, EventEmitter, Output } from '@angular/core';
import { examCategories } from '../../data/exam-categories.data';

@Component({
  selector: 'app-exam-categories',
  templateUrl: './exam-categories.component.html',
  styleUrl: './exam-categories.component.scss'
})
export class ExamCategoriesComponent {
  categories = examCategories;
  @Output() categorySelected = new EventEmitter<string>();
  @Output() startTest = new EventEmitter<void>();

  onCategoryClick(route: string): void {
    this.categorySelected.emit(route);
  }


  onStartTest(): void {
    this.startTest.emit();
  }
}
