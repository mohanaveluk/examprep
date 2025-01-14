import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModelExam } from '../../models/model-exam.interface';

@Component({
  selector: 'app-trial-exam-view-dialog',
  templateUrl: './trial-exam-view-dialog.component.html',
  styleUrl: './trial-exam-view-dialog.component.scss'
})
export class TrialExamViewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TrialExamViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public exam: ModelExam
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  formatDate(date: Date | undefined): string {
    
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  }
}
