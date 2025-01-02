import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModelExam } from '../../../../models/exam.model';

@Component({
  selector: 'app-model-test-detail-dialog',
  templateUrl: './model-test-detail-dialog.component.html',
  styleUrl: './model-test-detail-dialog.component.scss'
})
export class ModelTestDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ModelTestDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public exam: ModelExam
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
