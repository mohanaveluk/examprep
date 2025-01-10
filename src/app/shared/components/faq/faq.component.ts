import { Component } from '@angular/core';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
  icon: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  categories = ['General', 'Exams', 'Account', 'Subscription'];
  selectedCategory = 'General';

  faqItems: FaqItem[] = [
    {
      category: 'General',
      question: 'What is Medical Entrance Exam Prep?',
      answer: 'Medical Entrance Exam Prep is a comprehensive platform designed to help medical students prepare for their entrance examinations through practice tests, detailed explanations, and performance analytics.',
      icon: 'school'
    },
    {
      category: 'General',
      question: 'How can I get started?',
      answer: 'Getting started is easy! Simply create an account, choose a subscription plan that suits your needs, and begin taking practice tests. We recommend starting with our diagnostic test to assess your current knowledge level.',
      icon: 'play_circle'
    },
    {
      category: 'Exams',
      question: 'What types of questions are included?',
      answer: 'Our question bank includes multiple choice, true/false, and case-based questions covering Basic Medical Sciences, Clinical Sciences, and Medical Ethics. All questions are crafted by experienced medical professionals.',
      icon: 'quiz'
    },
    {
      category: 'Exams',
      question: 'How are the practice tests structured?',
      answer: "Practice tests typically contain 50-100 questions and are timed to simulate real exam conditions. Each test covers multiple subjects, and you'll receive detailed feedback and explanations after completion.",
      icon: 'assignment'
    },
    {
      category: 'Account',
      question: 'Can I track my progress?',
      answer: 'Yes! Our platform provides detailed analytics of your performance, including subject-wise analysis, improvement trends, and comparison with peer averages. You can access these insights from your dashboard.',
      icon: 'trending_up'
    },
    {
      category: 'Account',
      question: 'How can I reset my password?',
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. Enter your registered email address, and we'll send you instructions to create a new password.",
      icon: 'lock_reset'
    },
    {
      category: 'Subscription',
      question: 'What subscription plans are available?',
      answer: 'We offer three subscription tiers: Basic, Standard, and Premium. Each plan provides different levels of access to our question bank, study materials, and features. Visit our pricing page for detailed information.',
      icon: 'card_membership'
    },
    {
      category: 'Subscription',
      question: 'Can I upgrade my subscription?',
      answer: "Yes, you can upgrade your subscription at any time. The price difference will be prorated based on your current subscription's remaining time. Visit your account settings to upgrade.",
      icon: 'upgrade'
    }
  ];

  filterByCategory(category: string): FaqItem[] {
    return this.faqItems.filter(item => item.category === category);
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
  }
}
