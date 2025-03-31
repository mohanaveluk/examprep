import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Question, QuestionResult } from '../../models/exam.model';
import { ModelQuestionService } from '../model-question.service';
import { ModelExamService } from '../model-exam.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface QuestionAttempt {
  question: Question;
  selectedAnswers: number[];
  result: QuestionResult;
}

interface SectionScore {
  name: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

interface TestSummary {
  examTitle: string;
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  sectionScores: SectionScore[];
}

interface SubjectContent1 {
  [key: string]: {
    content: string;
    keyPoints: string[];
    imageUrl?: string;
  };
}

interface ContentImage {
  url: string;
  alt: string;
  caption?: string;
}

interface ContentSection {
  title: string;
  content: string;
  images?: ContentImage[];
  subsections?: {
    title: string;
    content: string;
    images?: ContentImage[];
  }[];
}

interface SubjectContent {
  [key: string]: {
    sections: ContentSection[];
    keyPoints: string[];
    references?: string[];
  };
}


@Component({
  selector: 'app-model-question',
  templateUrl: './model-question.component.html',
  styleUrl: './model-question.component.scss'
})
export class ModelQuestionComponent implements OnInit, OnDestroy{
  examId: string = '';
  exam: any;
  currentQuestion: Question | null = null;
  selectedAnswers: number[] = [];
  questionResult: QuestionResult | null = null;
  isSubmitted = false;
  currentIndex = 0;
  totalQuestions = 0;
  error: string | null = null;
  
  startTime!: number;
  questionAttempts: QuestionAttempt[] = [];
  testSummary: TestSummary | null = null;
  isCompleted = false;
  showSummary = false;
  subjectContent: SafeHtml = '';
  keyPoints: string[] = [];
  readonly QUESTIONS_PER_TEST = 10;

  // Divider dragging properties
  isDragging = false;
  questionSectionWidth = 800; // Initial width
  private startX = 0;
  private startWidth = 0;

  warningMessage: string = "";
  loading = false;

  // Mock subject content - In real app, this would come from a service
  private subjectContents1: SubjectContent1 = {
    'Anatomy': {
      content: `
        <p>Anatomy is the study of the structure of living things. It is a branch of natural science that deals with the structural organization of living things.</p>
        <img src="https://example.com/anatomy.jpg" alt="Anatomy diagram">
        <p>Understanding anatomy is crucial for medical professionals as it forms the foundation for understanding how the body works and how different systems interact.</p>
      `,
      keyPoints: [
        'Study of body structure',
        'Includes organs and systems',
        'Essential for medical diagnosis',
        'Basis for surgical procedures'
      ]
    },
    'Physiology': {
      content: `
        <p>Physiology is the study of how living systems function. It describes how organs, cells, and systems within an organism work together to maintain life.</p>
        <img src="https://example.com/physiology.jpg" alt="Physiology diagram">
        <p>Understanding physiology helps in diagnosing diseases and determining appropriate treatments.</p>
      `,
      keyPoints: [
        'Study of body functions',
        'Cellular processes',
        'System interactions',
        'Homeostasis maintenance'
      ]
    }
  };

  private subjectContents: SubjectContent = {
    'Anatomy': {
      sections: [
        {
          title: 'Skeletal System Overview',
          content: 'The skeletal system provides structural support and protection for the body\'s organs.',
          images: [
            {
              url: '/assets/subject/02/skeleton-anterior.png',
              alt: 'Anterior view of human skeleton',
              caption: 'Anterior view showing major bones'
            },
            {
              url: '/assets/subject/02/skeleton-lateral.png',
              alt: 'Lateral view of human skeleton',
              caption: 'Lateral view highlighting vertebral column'
            }
          ],
          subsections: [
            {
              title: 'Bone Classification',
              content: 'Bones are classified into four main types: long bones, short bones, flat bones, and irregular bones.',
              images: [
                {
                  url: 'https://example.com/bone-types.jpg',
                  alt: 'Types of bones',
                  caption: 'Different bone classifications'
                }
              ]
            },
            {
              title: 'Joint Types',
              content: 'Joints are classified by their structure and function into synovial, fibrous, and cartilaginous joints.',
              images: [
                {
                  url: 'https://example.com/joint-types.jpg',
                  alt: 'Types of joints',
                  caption: 'Major joint classifications'
                }
              ]
            }
          ]
        },
        {
          title: 'Muscular System Integration',
          content: 'The muscular system works in conjunction with the skeleton to enable movement.',
          images: [
            {
              url: 'https://example.com/muscle-anterior.jpg',
              alt: 'Anterior muscular view',
              caption: 'Major muscle groups - anterior view'
            },
            {
              url: 'https://example.com/muscle-posterior.jpg',
              alt: 'Posterior muscular view',
              caption: 'Major muscle groups - posterior view'
            }
          ]
        }
      ],
      keyPoints: [
        'Understand bone classification and structure',
        'Learn joint types and their movements',
        'Study muscle attachments and actions',
        'Focus on clinical applications'
      ],
      references: [
        'Gray\'s Anatomy, 41st Edition',
        'Clinical Anatomy by Regions, 10th Edition'
      ]
    },
    'Physiology': {
      sections: [
        {
          title: 'Cellular Transport Mechanisms',
          content: 'Cellular transport involves various mechanisms for moving substances across cell membranes.',
          images: [
            {
              url: '/assets/subject/01/active_transport.png',
              alt: 'Passive transport diagram',
              caption: 'Passive transport mechanisms'
            },
            {
              url: '/assets/subject/01/passive_transport.png',
              alt: 'Active transport diagram',
              caption: 'Active transport processes'
            }
          ],
          subsections: [
            {
              title: 'Passive Transport',
              content: 'Movement of molecules down their concentration gradient without energy expenditure.',
              images: [
                {
                  url: '/assets/subject/01/diffusion.jpg',
                  alt: 'Diffusion process',
                  caption: 'Simple and facilitated diffusion'
                }
              ]
            },
            {
              title: 'Active Transport',
              content: 'Energy-dependent movement of molecules against their concentration gradient.',
              images: [
                {
                  url: '/assets/subject/01/sodium_potassium.jpg',
                  alt: 'Sodium-potassium pump',
                  caption: 'Na+/K+ ATPase pump mechanism'
                }
              ]
            }
          ]
        }
      ],
      keyPoints: [
        'Master transport mechanisms',
        'Understand energy requirements',
        'Learn concentration gradients',
        'Study membrane proteins'
      ],
      references: [
        'Guyton and Hall Textbook of Medical Physiology',
        'Cellular Physiology and Neurophysiology'
      ]
    }
  };

  constructor(
    private modelExamService: ModelExamService,
    private modelQuestionService: ModelQuestionService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.startTime = Date.now();
  }

  ngOnInit() {
    this.examId = this.route.snapshot.params['examId'];
    this.loadExam(this.examId);
    this.loadQuestion();
  }

  ngOnDestroy(): void {
    // Clean up any event listeners if needed
    this.isDragging = false;
  }

  // Divider dragging methods
  startDragging(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startWidth = this.questionSectionWidth;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    const diff = event.clientX - this.startX;
    const newWidth = this.startWidth + diff;

    // Apply min and max constraints
    if (newWidth >= 400 && newWidth <= 1400) {
      this.questionSectionWidth = newWidth;
    }
  }

  @HostListener('document:mouseup')
  stopDragging() {
    this.isDragging = false;
  }
  
  loadExam(examId: string) {
    this.loading = true;
    this.modelExamService.getExam(examId).subscribe({
      next: (response: any) => {
        if(response.success){
          this.exam = response.data;
        }
        else{
          this.warningMessage = "No exam found at this moment..."
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load exam. Please try again later.';
        console.error('Failed to load exam:', error);
      }
    });
  }

  loadQuestion() {
    this.loading = true;
    const examId = this.route.snapshot.params['examId'];
    this.modelQuestionService.getQuestion(examId, this.currentIndex).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.currentQuestion = response.data.question;
        this.totalQuestions = response.data.totalQuestions;
        this.resetQuestion();
        this.loadSubjectContent();
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load question. Please try again later.';
        console.error('Failed to load question:', error)
      }
    });
  }

  private generateContentHtml(subject: string): string {
    const content = this.subjectContents[subject];
    if (!content) return '';

    let html = '';

    // Generate HTML for each section
    content.sections.forEach(section => {
      html += `<div class="content-section">
        <h3>${section.title}</h3>
        <p>${section.content}</p>`;

      // Add section images
      if (section.images?.length) {
        html += '<div class="image-gallery">';
        section.images.forEach(image => {
          html += `
            <figure>
              <img src="${image.url}" alt="${image.alt}" style="width:100%">
              ${image.caption ? `<figcaption>${image.caption}</figcaption>` : ''}
            </figure>`;
        });
        html += '</div>';
      }

      // Add subsections
      if (section.subsections?.length) {
        section.subsections.forEach(subsection => {
          html += `
            <div class="subsection">
              <h4>${subsection.title}</h4>
              <p>${subsection.content}</p>`;

          // Add subsection images
          if (subsection.images?.length) {
            html += '<div class="image-gallery">';
            subsection.images.forEach(image => {
              html += `
                <figure>
                  <img src="${image.url}" alt="${image.alt}" style="width:100%">
                  ${image.caption ? `<figcaption>${image.caption}</figcaption>` : ''}
                </figure>`;
            });
            html += '</div>';
          }

          html += '</div>';
        });
      }

      html += '</div>';
    });

    // Add references if available
    if (content.references?.length) {
      html += `
        <div class="references">
          <h4>References</h4>
          <ul>
            ${content.references.map(ref => `<li>${ref}</li>`).join('')}
          </ul>
        </div>`;
    }

    return html;
  }

  private loadSubjectContent() {
    if (this.currentQuestion) {
      const content = this.subjectContents[this.currentQuestion.subject!];
      if (content) {
        const html = this.generateContentHtml(this.currentQuestion.subject!);
        this.subjectContent = this.sanitizer.bypassSecurityTrustHtml(html);
        this.keyPoints = content.keyPoints;
      }
    }
  }

  private loadSubjectContent1() {
    if (this.currentQuestion) {
      const content = this.subjectContents1[this.currentQuestion?.subject!];
      if (content) {
        this.subjectContent = this.sanitizer.bypassSecurityTrustHtml(content.content);
        this.keyPoints = content.keyPoints;
      }
    }
  }

  resetQuestion() {
    this.selectedAnswers = [];
    this.questionResult = null;
    this.isSubmitted = false;
  }

  onOptionSelect(optionId: number) {
    if (this.isSubmitted) return;

    if (this.currentQuestion?.type === 'single') {
      this.selectedAnswers = [optionId];
    } else {
      const index = this.selectedAnswers.indexOf(optionId);
      if (index === -1) {
        if (!this.currentQuestion?.maxSelections || 
            this.selectedAnswers.length < this.currentQuestion.maxSelections) {
          this.selectedAnswers.push(optionId);
        }
      } else {
        this.selectedAnswers.splice(index, 1);
      }
    }
  }

  isOptionSelected(optionId: number): boolean {
    return this.selectedAnswers.includes(optionId);
  }

  getOptionClass(optionId: number): string {
    if (!this.isSubmitted) return '';

    const isSelected = this.isOptionSelected(optionId);
    const isCorrect = this.questionResult?.correctAnswers.includes(optionId);

    if (isSelected && isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'incorrect';
    if (!isSelected && isCorrect) return 'correct highlight';
    
    return '';
  }

  onSubmit() {
    if (!this.currentQuestion || this.selectedAnswers.length === 0) return;
    const examId = this.route.snapshot.params['examId'];
    this.modelQuestionService.submitAnswer(
      examId,
      this.currentQuestion.id,
      this.selectedAnswers
    ).subscribe({
      next: (result: any) => {
        this.questionResult = result.data;
        this.isSubmitted = true;
        this.storeQuestionAttempt();
        
        if (this.questionAttempts.length === this.QUESTIONS_PER_TEST || this.questionAttempts.length === this.totalQuestions) {
          this.isCompleted = true; //this.generateTestSummary();
        }
      },
      error: (error) => console.error('Failed to submit answer:', error)
    });
  }

  private storeQuestionAttempt() {
    if (this.currentQuestion && this.questionResult) {
      this.questionAttempts.push({
        question: this.currentQuestion,
        selectedAnswers: this.selectedAnswers,
        result: this.questionResult
      });
    }
  }

  private generateTestSummary() {
    const correctAnswers = this.questionAttempts.filter(
      attempt => attempt.result.isCorrect
    ).length;

    const totalScore = (correctAnswers / (this.totalQuestions >= this.QUESTIONS_PER_TEST ? this.QUESTIONS_PER_TEST: this.totalQuestions)) * 100;
    const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);

    // Group questions by subject/section
    const sectionScores = this.calculateSectionScores();

    this.testSummary = {
      examTitle: 'Model Test',
      totalScore,
      totalQuestions: (this.totalQuestions >= this.QUESTIONS_PER_TEST) ? this.QUESTIONS_PER_TEST : this.totalQuestions,
      correctAnswers,
      timeTaken,
      sectionScores
    };

    this.showSummary = true;
  }

  private calculateSectionScores(): SectionScore[] {
    const sectionMap = new Map<string, { correct: number, total: number }>();

    this.questionAttempts.forEach(attempt => {
      const section = attempt.question.subject || 'General';
      const current = sectionMap.get(section) || { correct: 0, total: 0 };
      
      sectionMap.set(section, {
        correct: current.correct + (attempt.result.isCorrect ? 1 : 0),
        total: current.total + 1
      });
    });

    return Array.from(sectionMap.entries()).map(([name, stats]) => ({
      name,
      score: (stats.correct / stats.total) * 100,
      totalQuestions: stats.total,
      correctAnswers: stats.correct
    }));
  }


  next() {
    if (this.currentIndex < this.totalQuestions - 1 || (this.totalQuestions >= this.QUESTIONS_PER_TEST && this.currentIndex < this.QUESTIONS_PER_TEST - 1)) {
      this.currentIndex++;
      this.loadQuestion();
    } else {
      //this.router.navigate(['/exam/list']);
    }
  }

  get progressPercentage(): number {
    return ((this.currentIndex + 1) / ((this.totalQuestions >= this.QUESTIONS_PER_TEST) ? this.QUESTIONS_PER_TEST : this.totalQuestions)) * 100;
  }

  summary(){
    this.generateTestSummary();
  }

  tryAgain(): void {
    // Navigate to start a new test
    this.router.navigate(['/exam/trial']);
  }
}
