import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InquiryDashboardComponent } from './inquiry-dashboard/inquiry-dashboard.component';

import { AuthGuard } from '../auth/auth.guard';
import { QuestionDetailComponent } from './question-detail/question-detail.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InquiryRoutingModule { }