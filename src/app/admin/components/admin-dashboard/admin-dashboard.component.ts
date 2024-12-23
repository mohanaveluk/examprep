import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit{
  stats = [
    { title: 'Total Users', count: 1250, icon: 'people', color: '#4CAF50' },
    { title: 'Active Exams', count: 45, icon: 'assignment', color: '#2196F3' },
    { title: 'Pending Inquiries', count: 28, icon: 'question_answer', color: '#FF9800' },
    { title: 'Revenue', count: '$15,750', icon: 'payments', color: '#9C27B0' }
  ];

  constructor(private headerService: HeaderService){}

  ngOnInit(): void {
    this.headerService.setTitle("Admin Dashboard");
  }
}