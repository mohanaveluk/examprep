import { ExamCategory } from '../models/exam-category.interface';

export const examCategories: ExamCategory[] = [
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