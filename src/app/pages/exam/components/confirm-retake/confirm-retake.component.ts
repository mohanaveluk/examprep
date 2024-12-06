import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-retake-confirm',
  templateUrl: './confirm-retake.component.html',
  styleUrls: ['./confirm-retake.component.scss']
})
export class ConfirmRetakeComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmRetakeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { examId: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}