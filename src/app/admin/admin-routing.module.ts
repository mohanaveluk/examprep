import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminInquiryOverviewComponent } from '../pages/inquiry/components/admin-inquiry-overview/admin-inquiry-overview.component';
import { AuthGuard } from '../pages/auth/auth.guard';
import { UserManagementComponent } from './user-management/user-management.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      {
        path: 'inquiry-overview',
        component: AdminInquiryOverviewComponent,
        canActivate: [AuthGuard]
        // In real app, add additional admin role guard
      },
      {
        path: 'users',
        component: UserManagementComponent,
        canActivate: [AuthGuard]
        // In real app, add additional admin role guard
      },
      {
        path: 'exam',
        canActivate: [AuthGuard],
        loadChildren: () => import('./exam/examlist.module').then(m => m.ExamListModule)
      },
      {
        path: 'group',
        canActivate: [AuthGuard],
        loadChildren: () => import('./user-group/usergroup.module').then(m => m.UserGroupModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }