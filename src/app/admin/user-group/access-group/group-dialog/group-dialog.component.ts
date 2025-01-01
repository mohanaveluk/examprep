import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject, takeUntil } from 'rxjs';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { Group, Permission } from '../../../../shared/models/group.model';
import { RbacService } from '../../../../pages/auth/rbac.service';


@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrl: './group-dialog.component.scss'
})
export class GroupDialogComponent  implements OnInit, OnDestroy{
  @ViewChild('permissionList') permissionList!: MatSelectionList;
  
  groupForm!: FormGroup;
  isEditing: boolean;
  availablePermissions: Permission[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private rbacService: RbacService,
    private dialogRef: MatDialogRef<GroupDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { group?: Group }
  ) {
    this.isEditing = !!data.group;
    this.initForm();
  }

  ngOnInit() {
    this.loadPermissions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.groupForm = this.fb.group({
      name: [this.data.group?.name || '', [Validators.required]],
      description: [this.data.group?.description || '', [Validators.required]],
      permissions: [[]], //[this.data.group?.permissions || []]
    });
  }

  private loadPermissions(): void {
    // In a real app, this would be an API call to get available permissions
    /*
    this.availablePermissions = [
      { id: '1', resource: 'exams', action: 'view', description: 'View exams' },
      { id: '2', resource: 'exams', action: 'create', description: 'Create exams' },
      { id: '3', resource: 'exams', action: 'edit', description: 'Edit exams' },
      { id: '4', resource: 'questions', action: 'view', description: 'View questions' },
      { id: '5', resource: 'questions', action: 'create', description: 'Create questions' },
      { id: '6', resource: 'questions', action: 'edit', description: 'Edit questions' }
    ];*/
    this.loading = true;
    this.rbacService.getPermissions().pipe(takeUntil(this.destroy$)).subscribe({
      next: (permissions) => {
        this.availablePermissions = permissions;
        this.loading = false;

        // If editing, update the form with selected permissions
        if (this.isEditing && this.data.group?.permissions) {
          const selectedPermissionIds = this.data.group.permissions.map(p => p.id);
          this.groupForm.patchValue({ permissions: selectedPermissionIds });
        }
        
      },
      error: (error) => {
        this.snackBar.open('Failed to load permissions', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });

  }

  isPermissionSelected1(permissionId: string): boolean {
    const selectedPermissions = this.groupForm.get('permissions')?.value || [];
    if(selectedPermissions.length > 0 && typeof selectedPermissions[0] === "object"){
      const hasPermission = selectedPermissions.some((permission: any) => permission.id === permissionId);
      return hasPermission;
    }
    
    const isSelected = selectedPermissions.includes(permissionId);
    return isSelected;
  }

  isPermissionSelected(permissionId: string): boolean {
    if (this.isEditing && this.data.group?.permissions) {
      return this.data.group.permissions.some(p => p.id === permissionId);
    }
    return false;
  }

  onPermissionChange(permissionId: string, isChecked: boolean): void {
    const currentPermissions = this.groupForm.get('permissions')?.value || [];
    let updatedPermissions: string[];

    if (isChecked) {
      updatedPermissions = [...currentPermissions, permissionId];
    } else {
      updatedPermissions = currentPermissions.filter((id: string) => id !== permissionId);
    }

    this.groupForm.patchValue({ permissions: updatedPermissions });
  }

  updatePermissions(selectedOptions: MatListOption[]): void {
    console.log('Selection changed:', selectedOptions); // Debug log
    const selectedPermissionIds = selectedOptions.map(option => option.value);
    this.groupForm.patchValue({ permissions: selectedPermissionIds }, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      const formValue = this.groupForm.value;
      const selectedPermissions = this.availablePermissions.filter(p => 
        formValue.permissions.includes(p.id)
      );

      const groupData = {
        ...formValue,
        permissions: selectedPermissions
      };
      
      const request$ = this.isEditing ?
        this.rbacService.updateGroup(this.data.group!.id, groupData) :
        this.rbacService.createGroup(groupData);

      request$.subscribe({
        next: () => {
          this.snackBar.open(
            `Group ${this.isEditing ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open(
            `Failed to ${this.isEditing ? 'update' : 'create'} group`,
            'Close',
            { duration: 3000 }
          );
        }
      });
    }
  }
}
