import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminExam } from '../examlist.service';

@Component({
  selector: 'app-exam-dialog',
  templateUrl: './exam-dialog.component.html',
  styleUrl: './exam-dialog.component.scss'
})
export class ExamDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ExamDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public exam: AdminExam
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  formatDate(date: Date | undefined): string {
    
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  }
}
