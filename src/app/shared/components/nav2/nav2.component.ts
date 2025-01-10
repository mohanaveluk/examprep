import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { async, Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../../pages/auth/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../../pages/auth/user-profile/services/profile.service';
@Component({
  selector: 'app-nav2',
  templateUrl: './nav2.component.html',
  styleUrl: './nav2.component.scss'
})
export class Nav2Component implements OnInit, OnDestroy{
  isUserLoggedIn = false;
  userName!: string;
  isHandset$: Observable<boolean>;
  userEmail = '';
  userInitials: string = '';
  userAvatar: string | null = null;
  private profileSubscription?: Subscription;
  
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private profileService: ProfileService,
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
    //this.updateUserInitials();
    this.authService.isUserLoggedIn().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.loadUserProfile();
        this.userName = this.authService.getUserName();
        this.userInitials = this.getUserInitials(this.userName);
      }
    });

    // Subscribe to profile updates
    this.profileSubscription = this.profileService.profileUpdated$.subscribe(() => {
      this.loadUserProfile();
    });
  }

  ngOnDestroy() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  private loadUserProfile() {
    this.profileService.getProfile().subscribe(profile => {
      this.userName = `${profile.first_name} ${profile.last_name}`;
      this.userEmail = profile.email;
      this.userAvatar = profile.profileImage;
      this.updateUserInitials();
    });
  }

  updateUserInitials() {
    this.userInitials = this.userName
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

  logout() {
    this.authService.logout().subscribe((response) => {
      console.log(response.message);
      this.router.navigate(['/auth/login']);
    });
  }
}
