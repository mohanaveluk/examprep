import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RbacService } from '../../../pages/auth/rbac.service';
import { MatDialog } from '@angular/material/dialog';
import { GroupDetailsDialogComponent } from './group-details-dialog/group-details-dialog.component';
import { HeaderService } from '../../services/header.service';

interface GroupPermission {
  id: string;
  name: string;
  description: string;
  permissions: {
    resource: string;
    action: string;
    description: string;
  }[];
}

@Component({
  selector: 'app-user-groups-view',
  templateUrl: './user-groups-view.component.html',
  styleUrl: './user-groups-view.component.scss'
})
export class UserGroupsViewComponent {
  dataSource: MatTableDataSource<GroupPermission>;
  displayedColumns = ['name', 'description', 'permissionCount', 'actions'];
  loading = true;

  constructor(
    private rbacService: RbacService,
    private headerService: HeaderService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<GroupPermission>([]);
  }

  ngOnInit(): void {
    this.headerService.setTitle("Admin - My Access");
    this.loadUserGroups();
  }

  private loadUserGroups(): void {
    this.loading = true;
    this.rbacService.getMyGroups().subscribe({
      next: (groups: any) => {
        this.dataSource.data = groups;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading groups:', error);
        this.loading = false;
      }
    });
  }

  viewGroupDetails(group: GroupPermission): void {
    this.dialog.open(GroupDetailsDialogComponent, {
      width: '800px',
      data: group,
      autoFocus: false
    });
  }

  getPermissionCount(group: GroupPermission): number {
    return group.permissions?.length || 0;
  }
}
