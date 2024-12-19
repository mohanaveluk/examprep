import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  constructor(private router: Router) {}

  navigateToExam(route: string): void {
    this.router.navigate([route]);
  }

  navigateToModelExam(): void {
    this.router.navigate(['/exam/model']);
  }
}
