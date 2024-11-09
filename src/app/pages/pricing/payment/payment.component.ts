import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PricingService, PricingPlan } from '../pricing.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  plan: PricingPlan | null = null;
  paymentForm: FormGroup;
  processing = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pricingService: PricingService,
    private snackBar: MatSnackBar
  ) {
    this.paymentForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });
  }

  ngOnInit() {
    const planId = this.route.snapshot.params['planId'];
    this.pricingService.getPlan(planId).subscribe({
      next: (plan) => this.plan = plan,
      error: () => this.router.navigate(['/pricing/plans'])
    });
  }

  onSubmit() {
    if (this.paymentForm.valid && this.plan) {
      this.processing = true;
      this.pricingService.processPayment(this.plan.id, this.paymentForm.value)
        .subscribe({
          next: () => {
            this.snackBar.open('Payment successful!', 'Close', { duration: 3000 });
            this.router.navigate(['/pricing/account']);
          },
          error: (error) => {
            this.snackBar.open('Payment failed: ' + error.message, 'Close', { duration: 3000 });
            this.processing = false;
          }
        });
    }
  }

  backToList() {
    this.router.navigate(['/pricing/plans']);
  }
}
