import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../shared/models/auth.model';
import { UserService } from './services/user-service.service';
import { UserEditDialogComponent } from '../components/user-edit-dialog/user-edit-dialog.component';
import { UserViewDialogComponent } from '../components/user-view-dialog/user-view-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'mobile', 'role', 'status', 'since', 'actions'];
  loading = false;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users: any) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.showError('Failed to load users');
        this.loading = false;
      }
    });
  }

  viewUser(user: User): void {
    this.dialog.open(UserViewDialogComponent, {
      width: '500px',
      data: user
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.userService.updateUser(user.uguid, result).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex(u => u.uguid === user.uguid);
            if (index !== -1) {
              //this.users[index] = updatedUser;
              this.users = [
                ...this.users.slice(0, index),
                updatedUser,
                ...this.users.slice(index + 1)
              ];
            }
            this.showSuccess('User updated successfully');
            this.loading = false;
          },
          error: (error) => {
            this.showError('Failed to update user');
            this.loading = false;
          }
        });
      }
    });
  }

  toggleUserStatus(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: `${user.is_active ? 'Deactivate' : 'Activate'} User`,
        message: `Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} ${user.email}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.userService.toggleUserStatus(user.uguid, !user.is_active).subscribe({
          next: (updatedUser) => {
            const index = this.users.findIndex(u => u.uguid === user.uguid);
            if (index !== -1) {
              //this.users[index] = updatedUser;
              // Create a new array reference to trigger change detection
              this.users = [
                ...this.users.slice(0, index),
                updatedUser,
                ...this.users.slice(index + 1)
              ];
            }
            this.showSuccess(`User ${updatedUser.is_active ? 'activated' : 'deactivated'} successfully`);
            this.loading = false;
          },
          error: (error) => {
            this.showError('Failed to update user status');
            this.loading = false;
          }
        });
      }
    });
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
