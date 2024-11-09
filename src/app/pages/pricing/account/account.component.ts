import { Component } from '@angular/core';
import { AccountInfo, PricingService } from '../pricing.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  accountInfo: AccountInfo | null = null;

  constructor(private pricingService: PricingService) {}

  ngOnInit() {
    this.loadAccountInfo();
  }

  loadAccountInfo() {
    this.pricingService.getAccountInfo().subscribe(info => {
      this.accountInfo = info;
    });
  }

  formatDate(date: Date | undefined): string {
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  }

  getRemainingDays(date: Date | undefined): number {
    if (!date) return 0;
    const remaining = new Date(date).getTime() - Date.now();
    return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
  }

  getStatusColor(status: string): string {
    return status === 'active' ? 'primary' : 'warn';
  }
}
