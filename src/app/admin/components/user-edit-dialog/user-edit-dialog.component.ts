import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Role, User } from '../../../shared/models/auth.model';
import { UserService } from '../../user-management/services/user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrl: './user-edit-dialog.component.scss'
})
export class UserEditDialogComponent implements OnInit {
  userForm: FormGroup;
  roles: Role[] = [];
  loading = false;
  //roles = ['admin', 'manager', 'user'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: [this.user.first_name, Validators.required],
      lastName: [this.user.last_name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      mobile: [this.user.mobile, [Validators.pattern('^\\+?[1-9]\\d{1,14}$')]],
      roleGuid: ['', Validators.required]
    });
  }

  loadRoles(): void {
    this.loading = true;
    this.userService.getRoles().subscribe({
      next: (roles: any) => {
        this.roles = roles;
        this.userForm.patchValue({
          roleGuid: this.user.role.rguid
        });
        this.loading = false;
      },
      error: (error) => {
        this.showError('Failed to load roles');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}