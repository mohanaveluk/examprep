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



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    ProfileImageComponent,
    SocialLoginComponent,
    OtcLoginComponent,
    RequestResetComponent,
    ResetPasswordComponent
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
    FormsModule, 
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
