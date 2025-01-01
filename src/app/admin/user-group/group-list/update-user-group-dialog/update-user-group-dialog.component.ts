import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { RbacService } from '../../../../pages/auth/rbac.service';
import { AuthService } from '../../../../pages/auth/auth.service';


interface User {
  id: string;
  uguid: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  users: User[];
}

@Component({
  selector: 'app-update-user-group-dialog',
  templateUrl: './update-user-group-dialog.component.html',
  styleUrls: ['./update-user-group-dialog.component.scss']
})
export class UpdateUserGroupDialogComponent implements OnInit {
  form: FormGroup;
  users: User[] = [];
  filteredUsers: User[] = [];
  groups: Group[] = [];
  filteredGroups: Group[] = [];
  loading = true;
  userSearchControl = new FormControl('');
  groupSearchControl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateUserGroupDialogComponent>,
    private rbacService: RbacService,
    private userService: AuthService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data?: { group?: Group }
  ) {
    this.form = this.fb.group({
      groupId: ['', Validators.required],
      userIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.setupSearchListeners();
  }

  private loadData(): void {
    this.loading = true;
    
    forkJoin({
      users: this.userService.getAllUsers(),
      groups: this.rbacService.getAllGroupsWithUsers()
    }).subscribe({
      next: (data: any) => {
        this.users = data.users.data;
        this.filteredUsers = [...this.users];
        this.groups = data.groups;
        this.filteredGroups = [...this.groups];
        
        if (this.data?.group) {
          this.form.patchValue({
            groupId: this.data.group.id,
            userIds: this.data.group.users.map(user => user.uguid)
          });
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.snackBar.open('Failed to load data', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  groupName(groupId: string){
    return this.groups.find(g => g.id === groupId)?.name;
  }

  private setupSearchListeners(): void {
    this.userSearchControl.valueChanges.subscribe(searchTerm => {
      this.filterUsers(searchTerm);
    });

    this.groupSearchControl.valueChanges.subscribe(searchTerm => {
      this.filterGroups(searchTerm);
    });
  }

  filterUsers(searchTerm: string | null): void {
    if (!searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  filterGroups(searchTerm: string | null): void {
    if (!searchTerm) {
      this.filteredGroups = [...this.groups];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredGroups = this.groups.filter(group => 
      group.name.toLowerCase().includes(term) ||
      group.description.toLowerCase().includes(term)
    );
  }

  getUserInitials(user: User): string {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }

  getSelectedGroupDetails(): string {
    const groupId = this.form.get('groupId')?.value;
    const group = this.groups.find(g => g.id === groupId);
    return group ? `${group.name} - ${group.description}` : '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { groupId, userIds } = this.form.value;
      
      const assignments = userIds.map((userId: any) => 
        this.rbacService.addUserToGroup(userId, groupId)
      );

      forkJoin(assignments).subscribe({
        next: () => {
          this.snackBar.open('Users updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating users:', error);
          this.snackBar.open('Failed to update users', 'Close', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}