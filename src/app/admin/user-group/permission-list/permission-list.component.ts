import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Permission } from '../../../shared/models/group.model';
import { PermissionDialogComponent } from './permission-dialog/permission-dialog.component';
import { RbacService } from '../../../pages/auth/rbac.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { HeaderService } from '../../services/header.service';
@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrl: './permission-list.component.scss'
})
export class PermissionListComponent implements OnInit {
  displayedColumns: string[] = ['resource', 'action', 'description', 'actions'];
  permissions: Permission[] = [];
  
  @ViewChild(MatTable) table!: MatTable<Permission>;

  constructor(
    private permissionService: RbacService,
    private headerService: HeaderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle("Admin - Resource Setup");
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe({
      next: (data: Permission[]) => {
        this.permissions = data;
        this.table?.renderRows();
      },
      error: (error: any) => {
        this.snackBar.open('Failed to load permissions', 'Close', { duration: 3000 });
      }
    });
  }

  openDialog(permission?: Permission): void {
    if (permission) {
      // Get all permissions for the selected resource
      this.permissionService.getPermissionsByResource(permission.resource).subscribe({
        next: (permissions) => {
          const actions = permissions.map(p => p.action).join(', ');
          const descriptions = permissions.map(p => p.description).join(', ');

          const dialogRef = this.dialog.open(PermissionDialogComponent, {
            width: '600px',
            data: { 
              resource: permission.resource,
              actions,
              descriptions
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.loadPermissions();
            }
          });
        },
        error: (error: any) => {
          this.snackBar.open('Failed to load resource permissions', 'Close', { duration: 3000 });
        }
      });
    } else {
      const dialogRef = this.dialog.open(PermissionDialogComponent, {
        width: '600px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadPermissions();
        }
      });
    }
  }

  deletePermission(id: string, resource: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Permission',
        message: `Are you sure you want to delete all permissions for resource "${resource}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.permissionService.deletePermission(id).subscribe({
          next: () => {
            this.snackBar.open('Permissions deleted successfully', 'Close', { duration: 3000 });
            this.loadPermissions();
          },
          error: (error) => {
            if(error?.error?.message?.includes("referenced in group permissions")){
              this.snackBar.open('Failed to delete permissions as it is being used in one or more groups ', 'Close', { duration: 3000 });
            }
            else{
              this.snackBar.open('Failed to delete permissions', 'Close', { duration: 3000 });
            }
          }
        });
      }
    });
  }
}
