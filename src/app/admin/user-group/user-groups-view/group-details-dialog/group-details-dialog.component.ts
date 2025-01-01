import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-group-details-dialog',
  templateUrl: './group-details-dialog.component.html',
  styleUrl: './group-details-dialog.component.scss'
})
export class GroupDetailsDialogComponent {
  displayedColumns = ['resource', 'action', 'description'];
  resourceGroups: { [key: string]: any[] } = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.groupPermissionsByResource();
  }

  private groupPermissionsByResource(): void {
    this.data.permissions.forEach((permission: any) => {
      if (!this.resourceGroups[permission.resource]) {
        this.resourceGroups[permission.resource] = [];
      }
      this.resourceGroups[permission.resource].push(permission);
    });
  }

  getResourceKeys(): string[] {
    return Object.keys(this.resourceGroups).sort();
  }
}
