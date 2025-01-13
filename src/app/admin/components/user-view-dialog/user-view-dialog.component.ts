import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-user-view-dialog',
  templateUrl: './user-view-dialog.component.html',
  styleUrl: './user-view-dialog.component.scss'
})
export class UserViewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
