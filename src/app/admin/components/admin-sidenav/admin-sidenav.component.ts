import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-admin-sidenav',
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.css']
})
export class AdminSidenavComponent {
  @Input() isExpanded = true;
  @Output() toggleExpanded = new EventEmitter<void>();


  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: 'people', label: 'Users', route: '/admin/users' },
    { icon: 'assignment', label: 'Exams', route: '/admin/exam/list' },
    { icon: 'question_answer', label: 'Inquiries', route: '/admin/inquiries' },
    { icon: 'payments', label: 'Payments', route: '/admin/payments' },
    { icon: 'category', label: 'Category', route: '/admin/exam/category' }
  ];

  onToggleExpanded() {
    this.toggleExpanded.emit();
  }
}