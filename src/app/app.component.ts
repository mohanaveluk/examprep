import { Component, OnInit } from '@angular/core';
import { AuthService } from './pages/auth/auth.service';
import { Router } from '@angular/router';
import { TokenExpiryService } from './core/services/token-expiry.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'entrance-exam-prep';

  constructor(
    private authService: AuthService, 
    private tokenExpiryService: TokenExpiryService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.tokenExpiryService.startExpiryCheck();
  }
  
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
