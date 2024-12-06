import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-inactivity-dialog',
  template: `
  <div style="padding: 10px 15px 15px 0px;">
    <h2 mat-dialog-title>Test Paused</h2>
    <mat-dialog-content>
      <p>The test has been paused due to inactivity.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" [mat-dialog-close]="'resume'">
        Resume Test
      </button>
    </mat-dialog-actions>
  <div>  
  `
})
export class InactivityDialogComponent {
  constructor(public dialogRef: MatDialogRef<InactivityDialogComponent>) {
    dialogRef.disableClose = true;
  }
}