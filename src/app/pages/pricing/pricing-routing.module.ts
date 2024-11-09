import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { PricingPlansComponent } from './pricing-plans/pricing-plans.component';
import { PaymentComponent } from './payment/payment.component';
import { AccountComponent } from './account/account.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';

const routes: Routes = [
  {
    path: 'plans',
    component: PricingPlansComponent
  },
  {
    path: 'payment/:planId',
    component: PaymentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-history',
    component: PaymentHistoryComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }