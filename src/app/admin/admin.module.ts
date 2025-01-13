import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';


import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminSidenavComponent } from './components/admin-sidenav/admin-sidenav.component';
import { AdminFooterComponent } from './components/admin-footer/admin-footer.component';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExamListModule } from './exam/examlist.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
// import { GroupListComponent } from './user-group/group-list/group-list.component';
// import { UpdateUserGroupDialogComponent } from './user-group/group-list/update-user-group-dialog/update-user-group-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { UserGroupModule } from './user-group/usergroup.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserViewDialogComponent } from './components/user-view-dialog/user-view-dialog.component';
import { UserEditDialogComponent } from './components/user-edit-dialog/user-edit-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminHeaderComponent,
    AdminSidenavComponent,
    AdminFooterComponent,
    UserManagementComponent,
    UserViewDialogComponent,
    UserEditDialogComponent,
    // GroupListComponent,
    // UpdateUserGroupDialogComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatInputModule,
    MatListModule,
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
    MatChipsModule,
    MatSelectModule,
    MatOptionModule,
    ExamListModule,
    UserGroupModule
  ],
})
export class AdminModule { }