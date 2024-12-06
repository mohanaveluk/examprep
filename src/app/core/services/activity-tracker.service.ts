import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityTrackerService {
  private readonly INACTIVITY_TIMEOUT = 300000; // 30 seconds
  private activityTimer: any;
  private inactivitySubject = new Subject<void>();
  inactivity$ = this.inactivitySubject.asObservable();

  constructor(private ngZone: NgZone) {}

  startTracking(): void {
    this.resetTimer();
    this.addEventListeners();
  }

  stopTracking(): void {
    this.removeEventListeners();
    this.clearTimer();
  }

  private resetTimer(): void {
    this.clearTimer();
    this.ngZone.runOutsideAngular(() => {
      this.activityTimer = setTimeout(() => {
        this.ngZone.run(() => {
          this.inactivitySubject.next();
        });
      }, this.INACTIVITY_TIMEOUT);
    });
  }

  private clearTimer(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
  }

  private onActivity = (): void => {
    this.resetTimer();
  };

  private addEventListeners(): void {
    document.addEventListener('mousemove', this.onActivity);
    document.addEventListener('mousedown', this.onActivity);
    document.addEventListener('keydown', this.onActivity);
    document.addEventListener('touchstart', this.onActivity);
    document.addEventListener('scroll', this.onActivity);
  }

  private removeEventListeners(): void {
    document.removeEventListener('mousemove', this.onActivity);
    document.removeEventListener('mousedown', this.onActivity);
    document.removeEventListener('keydown', this.onActivity);
    document.removeEventListener('touchstart', this.onActivity);
    document.removeEventListener('scroll', this.onActivity);
  }
}