import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamService } from '../exam.service';
import { ExamData, ExamQuestion } from '../models/exam.model';

@Component({
  selector: 'app-exam-upload',
  templateUrl: './exam-upload.component.html',
  styleUrls: ['./exam-upload.component.scss']
})
export class ExamUploadComponent {
  examForm: FormGroup;
  isLoading = false;
  selectedFileName = '';
  questions: ExamQuestion[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private snackBar: MatSnackBar
  ) {
    this.examForm = this.fb.group({
      examTitle: ['', Validators.required],
      description: ['', Validators.required],
      file: [null, Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.examForm.patchValue({ file });
      this.processFile(file);
    }
  }

  async processFile(file: File): Promise<void> {
    this.isLoading = true;
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      this.questions = fileExt === 'csv'
        ? await this.examService.processCsvFile(file)
        : await this.examService.processExcelFile(file);
      
      this.snackBar.open('File processed successfully', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Error processing file', 'Close', { duration: 3000 });
      console.error('Error processing file:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onSubmit(): void {
    if (this.examForm.valid && this.questions.length > 0) {
      const examData: ExamData = {
        examTitle: this.examForm.get('examTitle')?.value,
        description: this.examForm.get('description')?.value,
        questions: this.questions
      };

      this.isLoading = true;
      this.examService.uploadExamData(examData).subscribe({
        next: () => {
          this.snackBar.open('Exam data uploaded successfully', 'Close', { duration: 3000 });
          this.resetForm();
        },
        error: (error) => {
          this.snackBar.open('Error uploading exam data', 'Close', { duration: 3000 });
          console.error('Error uploading exam data:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  private resetForm(): void {
    this.examForm.reset();
    this.questions = [];
    this.selectedFileName = '';
  }
}