import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../../pages/auth/auth.service';
import { ProfileService } from '../../../pages/auth/user-profile/services/profile.service';
import { Router } from '@angular/router';
import { map, Observable, shareReplay, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit{
  @Output() toggleMenu = new EventEmitter<void>();
  isUserLoggedIn = false;
  userName!: string;
  isHandset$: Observable<boolean> | undefined;
  userEmail = '';
  userInitials: string = '';
  userAvatar: string | null = null;
  private profileSubscription?: Subscription;
  
  constructor(
    public headerService: HeaderService,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay(),
      );

      this.isHandset$.subscribe(isHandset => {
        if (isHandset) {
          console.log('This is a handset device.');
        } else {
          console.log('This is not a handset device.');
        }
      });
  }
  
  ngOnInit() {
    this.authService.isUserLoggedIn().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.userName = this.authService.getUserName();
        this.userInitials = this.getUserInitials(this.userName);
      }
    });

    this.loadUserProfile();
    // Subscribe to profile updates
    this.profileSubscription = this.profileService.profileUpdated$.subscribe(() => {
      this.loadUserProfile();
    });
  }

  onToggleMenu() {
    this.toggleMenu.emit();
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