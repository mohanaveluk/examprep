import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RbacService } from '../../../pages/auth/rbac.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UpdateUserGroupDialogComponent } from './update-user-group-dialog/update-user-group-dialog.component';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss'
})
export class GroupListComponent  implements OnInit{
  @ViewChild(MatTable) table!: MatTable<any>;
  
  displayedColumns: string[] = ['name', 'description', 'users', 'permissions', 'actions'];
  groups: any[] = [];
  loading = true;


  constructor(
    private groupService: RbacService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGroups();
  }


  loadGroups(): void {
    this.loading = true;
    this.groupService.getAllGroupsWithUsers().subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        this.snackBar.open('Failed to load groups', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  removeUserFromGroup(userId: string, groupId: string, userName: string, groupName: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Remove User from Group',
        message: `Are you sure you want to remove ${userName} from ${groupName}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.groupService.removeUserFromGroup(userId, groupId).subscribe({
          next: () => {
            this.snackBar.open('User removed from group successfully', 'Close', { duration: 3000 });
            this.loadGroups();
          },
          error: (error: any) => {
            console.error('Error removing user:', error);
            this.snackBar.open('Failed to remove user from group', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  getPermissionsList(permissions: any[]): string {
    return permissions.map(p => `${p.resource} - ${p.action}`).join(', ');
  }

  

  openAddUserDialog(group?: any): void {
    const dialogRef = this.dialog.open(UpdateUserGroupDialogComponent, {
      width: '600px',
      data: { group },
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGroups();
      }
    });
  }
}
