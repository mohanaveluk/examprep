import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestResult } from '../test-history.service';

@Component({
  selector: 'app-test-detail-dialog',
  templateUrl: './test-detail-dialog.component.html',
  styleUrl: './test-detail-dialog.component.scss'
})
export class TestDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: TestResult, public dialogRef: MatDialogRef<TestDetailDialogComponent>) {}

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  getStatusColor(status: string): string {
    return status === 'Pass' ? 'primary' : 'warn';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
