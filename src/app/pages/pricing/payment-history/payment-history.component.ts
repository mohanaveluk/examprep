import { Component } from '@angular/core';
import { PaymentHistory, PricingService } from '../pricing.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.scss'
})
export class PaymentHistoryComponent {
  displayedColumns: string[] = ['date', 'planName', 'amount', 'validUntil', 'status'];
  payments: PaymentHistory[] = [];

  constructor(private pricingService: PricingService) {}

  ngOnInit() {
    this.loadPaymentHistory();
  }

  loadPaymentHistory() {
    this.pricingService.getPaymentHistory().subscribe(payments => {
      this.payments = payments;
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'success': return 'primary';
      case 'pending': return 'accent';
      case 'failed': return 'warn';
      default: return '';
    }
  }
}
