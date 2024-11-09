import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PricingService, PricingPlan } from '../pricing.service';
@Component({
  selector: 'app-pricing-plans',
  templateUrl: './pricing-plans.component.html',
  styleUrl: './pricing-plans.component.scss'
})
export class PricingPlansComponent {
  plans: PricingPlan[] = [];

  constructor(
    private pricingService: PricingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.pricingService.getPlans().subscribe(plans => {
      this.plans = plans;
    });
  }

  selectPlan(planId: string) {
    this.router.navigate(['/pricing/payment', planId]);
  }
}
