import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MenuItem {
  title: string;
  icon: string;
  link?: string;
  children?: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private sidenavExpandedSubject = new BehaviorSubject<boolean>(true);
  sidenavExpanded$ = this.sidenavExpandedSubject.asObservable();

  menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      link: '/admin/dashboard'
    },
    {
      title: 'Users',
      icon: 'people',
      children: [
        {
          title: 'User List',
          icon: 'list',
          link: '/admin/users/list'
        },
        {
          title: 'User Groups',
          icon: 'group_work',
          link: '/admin/users/groups'
        }
      ]
    },
    {
      title: 'Reports',
      icon: 'assessment',
      children: [
        {
          title: 'Analytics',
          icon: 'analytics',
          link: '/admin/reports/analytics'
        },
        {
          title: 'Statistics',
          icon: 'bar_chart',
          link: '/admin/reports/statistics'
        }
      ]
    },
    {
      title: 'Settings',
      icon: 'settings',
      link: '/admin/settings'
    }
  ];

  constructor() { }

  toggleSidenav() {
    this.sidenavExpandedSubject.next(!this.sidenavExpandedSubject.value);
  }

  getSidenavState() {
    return this.sidenavExpanded$;
  }
}