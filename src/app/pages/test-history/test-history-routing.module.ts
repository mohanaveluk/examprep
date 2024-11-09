import { NgModule, ViewChild } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { TestHistoryComponent } from './test-history/test-history.component';


const routes: Routes = [
  {
    path: 'history',
    component: TestHistoryComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestHistoryRoutingModule { }