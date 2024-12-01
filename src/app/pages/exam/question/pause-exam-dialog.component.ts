import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pause-exam-dialog',
  template: `
    <h2 mat-dialog-title>Pause Exam</h2>
    <mat-dialog-content>
      <p>Are you sure you want to pause the exam? You can resume it later from where you left off.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="'cancel'">Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="'pause'">Pause Exam</button>
    </mat-dialog-actions>
  `
})
export class PauseExamDialogComponent {
  constructor(public dialogRef: MatDialogRef<PauseExamDialogComponent>) {}
}