import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { RbacService } from '../../rbac.service';
import { AuthService } from '../../auth.service';

interface User {
  id: string;
  uguid: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-add-user-groups-dialog',
  templateUrl: './add-user-groups-dialog.component.html',
  styleUrl: './add-user-groups-dialog.component.scss'
})
export class AddUserGroupsDialogComponent implements OnInit {
  form: FormGroup;
  users: any[] = [];
  filteredUsers: User[] = [];
  groups: any[] = [];
  loading = true;
  searchControl = new FormControl('');


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserGroupsDialogComponent>,
    private groupService: RbacService,
    private userService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      userId: ['', Validators.required],
      groupIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;

    // Use forkJoin to make parallel API calls
    forkJoin({
      users: this.userService.getAllUsers(),
      groups: this.groupService.getGroups('')
    }).subscribe({
      next: (data: any) => {
        this.users = data.users.data;
        this.filteredUsers = [...this.users];
        this.groups = data.groups;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.snackBar.open('Failed to load data', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onSubmit1(): void {
    if (this.form.valid) {
      const { userId, groupIds } = this.form.value;   
      
      Promise.all(
        groupIds.map((groupId: string) => 
          this.groupService.addUserToGroup(userId, groupId)
        )
      ).then(() => {
        this.snackBar.open('User added to groups successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      }).catch(error => {
        console.error('Error adding user to groups:', error);
        this.snackBar.open('Failed to add user to groups', 'Close', { duration: 3000 });
      });
    }
  }


  filterUsers(event: any): void {
    const searchTerm = this.searchControl.value?.toLowerCase();
    
    if (!searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(user => 
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  getUserInitials(user: User): string {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }

  get selectedUser(): User | undefined {
    const userId = this.form.get('userId')?.value;
    return this.users.find(user => user.uguid === userId);
  }

  getSelectedUserDetails(): string {
    const user = this.selectedUser;
    return user ? `${user.firstName} ${user.lastName} (${user.email})` : '';
  }


  onSubmit(): void {
    if (this.form.valid) {
      const { userId, groupIds } = this.form.value;
      
      // Create an array of observables for each group assignment
      const assignments = groupIds.map((groupId: string) => 
        this.groupService.addUserToGroup(userId, groupId)
      );

      // Execute all assignments in parallel
      forkJoin(assignments).subscribe({
        next: () => {
          this.snackBar.open('User added to groups successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error adding user to groups:', error);
          this.snackBar.open('Failed to add user to groups', 'Close', { duration: 3000 });
        }
      });
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }

}
