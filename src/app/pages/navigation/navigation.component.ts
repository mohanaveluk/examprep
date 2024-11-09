import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  isLoggedIn = false;
  userName!: string;
  userInitials!: string;

  isHandset$: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router,     private breakpointObserver: BreakpointObserver ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit() {
    this.authService.isUserLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.userName = this.authService.getUserName();
        this.userInitials = this.getUserInitials(this.userName);
      }
    });
  }

  private getUserInitials(name: string): string {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
