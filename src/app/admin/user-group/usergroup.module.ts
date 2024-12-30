import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GroupListComponent } from './group-list/group-list.component';
import { UpdateUserGroupDialogComponent } from './group-list/update-user-group-dialog/update-user-group-dialog.component';
import { UserGroupRoutingModule } from './usergroup-routing.module';


@NgModule({
    declarations: [
        GroupListComponent,
        UpdateUserGroupDialogComponent,
    ],
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatSidenavModule,
      MatToolbarModule,
      MatListModule,
      MatExpansionModule,
      MatFormFieldModule,
      MatInputModule,
      MatCheckboxModule,
      MatRadioModule,
      MatSelectModule,
      MatChipsModule,
      MatIconModule,
      MatButtonModule,
      MatCardModule,
      MatMenuModule,
      MatDividerModule,
      MatTooltipModule,
      MatTableModule,
      MatSnackBarModule,
      MatSortModule,
      MatPaginatorModule,
      MatDialogModule,
      MatProgressSpinnerModule,
      UserGroupRoutingModule
    ],
    
  })
  export class UserGroupModule { }
  