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
    { icon: 'model_training', label: 'Model Exams', route: '/admin/exam/modelexam' },
    { icon: 'question_answer', label: 'Inquiries', route: '/admin/inquiry-overview' },
    { icon: 'payments', label: 'Payments', route: '/admin/payments' },
    { icon: 'category', label: 'Category', route: '/admin/exam/category' },
    { icon: 'app_registration', label: 'Create Resource', route: '/group/resource' },
    { icon: 'highlight', label: 'My Access', route: '/group/my-access' },
    { icon: 'blur_circular', label: 'Access Group', route: '/group/access-groups' },
    { icon: 'workspaces', label: 'Group Mgmt', route: '/group/list' }
  ];

  onToggleExpanded() {
    this.toggleExpanded.emit();
  }
}