import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface ExamCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  examCategories: ExamCategory[] = [
    {
      id: 'usmle',
      title: 'USMLE',
      description: 'United States Medical Licensing Examination',
      icon: 'medical_services',
      route: '/exam/usmle'
    },
    {
      id: 'comlex',
      title: 'COMLEX',
      description: 'Comprehensive Osteopathic Medical Licensing Examination',
      icon: 'healing',
      route: '/exam/comlex'
    },
    {
      id: 'board-cert',
      title: 'Board Certification',
      description: 'Medical Specialty Board Certification Exams',
      icon: 'verified',
      route: '/exam/board'
    },
    {
      id: 'nursing',
      title: 'Nursing Certifications',
      description: 'APRN, RN, and Specialty Nursing Certifications',
      icon: 'local_hospital',
      route: '/exam/nursing'
    }
  ];

  constructor(private router: Router) {}

  navigateToExam(route: string): void {
    this.router.navigate([route]);
  }

  navigateToModelExam(): void {
    this.router.navigate(['/exam/trial']);
  }
}
