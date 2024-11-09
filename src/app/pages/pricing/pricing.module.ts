import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PricingPlansComponent } from './pricing-plans/pricing-plans.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { AccountComponent } from './account/account.component';
import { PricingRoutingModule } from './pricing-routing.module';



@NgModule({
  declarations: [
    PricingPlansComponent,
    PaymentComponent,
    PaymentHistoryComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PricingRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressBarModule

  ]
})
export class PricingModule { }
