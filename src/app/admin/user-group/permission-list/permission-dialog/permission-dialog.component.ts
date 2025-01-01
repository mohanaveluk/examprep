import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RbacService } from '../../../../pages/auth/rbac.service';
import { PermissionAction } from '../../../../shared/models/permission/permission.model';


@Component({
  selector: 'app-permission-dialog',
  templateUrl: './permission-dialog.component.html',
  styleUrl: './permission-dialog.component.scss'
})
export class PermissionDialogComponent implements OnInit {
  form!: FormGroup;
  isEditing: boolean;
  availableActions: PermissionAction[] = [
    { name: 'create', description: '', selected: false },
    { name: 'edit', description: '', selected: false },
    { name: 'view', description: '', selected: false },
    { name: 'delete', description: '', selected: false }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PermissionDialogComponent>,
    private permissionService: RbacService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { 
      resource?: string;
      actions?: string;
      descriptions?: string;
    }
  ) {
    this.isEditing = !!data?.resource;
    this.initForm();
  }

  ngOnInit(): void {
    if (this.isEditing) {
      this.populateForm();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      resource: [{ 
        value: this.data?.resource || '', 
        disabled: this.isEditing 
      }, Validators.required],
      actions: this.fb.array([])
    });

    // Initialize actions form array
    this.availableActions.forEach(action => {
      (this.form.get('actions') as FormArray).push(
        this.fb.group({
          name: [action.name],
          selected: [false],
          description: ['']
        })
      );
    });
  }

  private populateForm(): void {
    if (this.data.actions && this.data.descriptions) {
      const actions = this.data.actions.split(',').map(a => a.trim());
      const descriptions = this.data.descriptions.split(',').map(d => d.trim());

      this.actions.controls.forEach((control, index) => {
        const actionIndex = actions.indexOf(control.get('name')?.value);
        if (actionIndex !== -1) {
          control.patchValue({
            selected: true,
            description: descriptions[actionIndex]
          });
        }
      });
    }
  }

  get actions(): FormArray {
    return this.form.get('actions') as FormArray;
  }

  onActionChange(index: number): void {
    const control = this.actions.at(index);
    const descriptionControl = control.get('description');
    
    if (control.get('selected')?.value) {
      descriptionControl?.enable();
    } else {
      descriptionControl?.disable();
      descriptionControl?.setValue('');
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const selectedActions = this.actions.controls
        .filter(control => control.get('selected')?.value)
        .map(control => ({
          action: control.get('name')?.value,
          description: control.get('description')?.value
        }));

      const payload = {
        resource: this.form.get('resource')?.value,
        actions: selectedActions.map(a => a.action).join(', '),
        descriptions: selectedActions.map(a => a.description).join(', ')
      };

      const request$ = this.isEditing ?
        this.permissionService.updatePermission(this.data.resource!, payload) :
        this.permissionService.createPermission(payload);

      request$.subscribe({
        next: () => {
          this.snackBar.open(
            `Resource permissions ${this.isEditing ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open(
            `Failed to ${this.isEditing ? 'update' : 'create'} resource permissions`,
            'Close',
            { duration: 3000 }
          );
        }
      });
    }
  }
}
