import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-model-test-card',
  templateUrl: './model-test-card.component.html',
  styleUrl: './model-test-card.component.scss'
})
export class ModelTestCardComponent {
  @Output() startTest = new EventEmitter<void>();

  onStartTest(): void {
    this.startTest.emit();
  }
}
