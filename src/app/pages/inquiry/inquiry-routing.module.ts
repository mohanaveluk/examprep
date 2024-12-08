import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InquiryDashboardComponent } from './inquiry-dashboard/inquiry-dashboard.component';

import { AuthGuard } from '../auth/auth.guard';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { AdminInquiryDashboardComponent } from './components/admin-inquiry-dashboard/admin-inquiry-dashboard.component';

const routes: Routes = [
  { 
    path: 'list',
    component: InquiryDashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'list/:id',
    component: QuestionDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/inquiries',
    component: AdminInquiryDashboardComponent,
    canActivate: [AuthGuard]
    // In real app, add additional admin role guard
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InquiryRoutingModule { }