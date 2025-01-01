import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupDialogComponent } from './group-dialog/group-dialog.component';
import { AuthService } from '../../../pages/auth/auth.service';
import { Group } from '../../../shared/models/group.model';
import { RbacService } from '../../../pages/auth/rbac.service';
import { HeaderService } from '../../services/header.service';


@Component({
  selector: 'app-access-group',
  templateUrl: './access-group.component.html',
  styleUrl: './access-group.component.scss'
})
export class AccessGroupComponent  implements OnInit {
  groups: Group[] = [];
  loading = false;
  user: any = {};

  constructor(
    private authService: AuthService,
    private rbacService: RbacService,
    private headerService: HeaderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle("Admin - Group Setup");
    this.loadGroups();
  }

  loadGroups(): void {
    this.loading = true;
    // In a real app, you'd get the current user's ID from an auth service
    this.user = this.authService.getUser() || {};
    const userId = this.user.id;

    this.rbacService.getGroups(userId).subscribe({
      next: (groups) => {
        this.groups = groups;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load groups', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  openGroupDialog(group?: Group): void {
    const dialogRef = this.dialog.open(GroupDialogComponent, {
      width: '600px',
      data: { group }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGroups();
      }
    });
  }

  deleteGroup(group: Group): void {
    if (confirm(`Are you sure you want to delete ${group.name}?`)) {
      this.rbacService.deleteGroup(group.id).subscribe({
        next: () => {
          this.snackBar.open('Group deleted successfully', 'Close', { duration: 3000 });
          this.loadGroups();
        },
        error: () => {
          this.snackBar.open('Failed to delete group', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
