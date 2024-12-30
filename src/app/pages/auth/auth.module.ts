import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ProfileImageComponent } from './user-profile/components/profile-image/profile-image.component';
import { SocialLoginComponent } from './login/components/social-login/social-login.component';
import { OtcLoginComponent } from './login/components/otc-login/otc-login.component';
import { MatIconModule } from '@angular/material/icon';
import { RequestResetComponent } from './request-reset/request-reset.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileUpdateSuccessComponent } from './user-profile/components/profile-update-success/profile-update-success.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { SharedModule } from '../../shared/shared.module';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { AccessGroupComponent } from './components/access-group/access-group.component';
import { GroupDialogComponent } from './components/access-group/group-dialog/group-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { GroupListComponent } from './components/group-list/group-list.component';
import { AddUserGroupsDialogComponent } from './components/add-user-groups-dialog/add-user-groups-dialog.component';
import { AddUserToGroupsComponent } from './components/add-user-to-groups/add-user-to-groups.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    ProfileImageComponent,
    SocialLoginComponent,
    OtcLoginComponent,
    RequestResetComponent,
    ResetPasswordComponent,
    ProfileUpdateSuccessComponent,
    EmailVerificationComponent,
    AccessGroupComponent,
    GroupDialogComponent,
    HasPermissionDirective,
    GroupListComponent,
    
    AddUserGroupsDialogComponent,
    AddUserToGroupsComponent,

  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,  
    MatIconModule, 
    MatProgressSpinnerModule,
    MatDialogModule,
    MatListModule,
    MatChipsModule,
    MatTableModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule, 
    ReactiveFormsModule,
    AuthRoutingModule,
    SharedModule
  ],
  exports: [
    HasPermissionDirective
  ],
})
export class AuthModule { }
