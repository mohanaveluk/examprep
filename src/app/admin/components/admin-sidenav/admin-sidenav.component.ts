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
    { icon: 'app_registration', label: 'Create Resource', route: '/admin/group/resource' },
    { icon: 'highlight', label: 'My Access', route: '/admin/group/my-access' },
    { icon: 'blur_circular', label: 'Access Group', route: '/admin/group/access-groups' },
    { icon: 'workspaces', label: 'Group Mgmt', route: '/admin/group/list' }
  ];

  onToggleExpanded() {
    this.toggleExpanded.emit();
  }
}