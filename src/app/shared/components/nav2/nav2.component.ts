import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { async, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../../pages/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav2',
  templateUrl: './nav2.component.html',
  styleUrl: './nav2.component.scss'
})
export class Nav2Component {
  isUserLoggedIn = false;
  userName!: string;
  isHandset$: Observable<boolean>;
  userInitials: string = '';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
      console.log((this.isHandset$));
  }

  ngOnInit() {
    // Mock user email for demo - in real app, get from auth service
    this.updateUserInitials('John Doe');
    this.authService.isUserLoggedIn().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.userName = this.authService.getUserName();
        this.userInitials = this.getUserInitials(this.userName);
      }
    });
  }

  updateUserInitials(name: string) {
    this.userInitials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  get isLoggedIn(): boolean {
    return this.isUserLoggedIn; //this.authService.isLoggedIn();
  }

  private getUserInitials(name: string): string {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  }

  logout()  {
    this.authService.logout().subscribe((response) => {
      console.log(response.message);
      this.router.navigate(['/auth/login']);
  });
  }
}
