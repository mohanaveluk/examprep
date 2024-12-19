import { Component } from '@angular/core';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-features-section',
  templateUrl: './features-section.component.html',
  styleUrl: './features-section.component.scss'
})
export class FeaturesSectionComponent {
  features: Feature[] = [
    {
      icon: 'library_books',
      title: 'Comprehensive Content',
      description: 'Extensive question bank covering all major medical exams'
    },
    {
      icon: 'analytics',
      title: 'Performance Analytics',
      description: 'Detailed analysis of your progress and weak areas'
    },
    {
      icon: 'devices',
      title: 'Multi-device Access',
      description: 'Study anywhere, anytime on any device'
    },
    {
      icon: 'support_agent',
      title: 'Expert Support',
      description: '24/7 assistance from medical professionals'
    }
  ];
}
