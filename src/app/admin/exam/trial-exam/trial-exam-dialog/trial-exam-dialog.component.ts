import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExamService } from '../../exam.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModelExamService } from '../../services/trial-exam.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface QuestionTemplate {
  text: string;
  type: 'single' | 'multiple' | 'true-false';
  subject: string;
  explanation: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}


@Component({
  selector: 'app-trial-exam-dialog',
  templateUrl: './trial-exam-dialog.component.html',
  styleUrl: './trial-exam-dialog.component.scss'
})
export class TrialExamDialogComponent {
  examForm!: FormGroup;
  isEditing: boolean;
  selectedFile: File | null = null;
  fileError: string | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  constructor(
    private fb: FormBuilder,
    private modelExamService: ModelExamService,
    private dialogRef: MatDialogRef<TrialExamDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditing = !!data.id;
    this.initForm();
    this.configureDialog();
    
  }

  private initForm(): void {
    this.examForm = this.fb.group({
      title: [this.data.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.data.description || '', [Validators.required, Validators.minLength(10)]],
      subject: [this.data.subject || '', [Validators.required, Validators.minLength(3)]],
      totalQuestions: [this.data.totalQuestions || 0, [Validators.required, Validators.min(1)]],
      passingScore: [this.data.passingScore || 70, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  private configureDialog(): void {
    // Prevent dialog close on backdrop click
    this.dialogRef.disableClose = true;
    
    // Handle escape key
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.dialogRef.close();
      }
    });
  }

  openFileInput(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    event.stopPropagation();
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.fileError = 'Please upload a valid CSV or Excel file';
      this.fileInput.nativeElement.value = '';
      return;
    }

    this.selectedFile = file;
    this.fileError = null;
    this.readFile(file);
  }

  removeFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
    this.fileError = null;
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const questions = this.parseFileContent(file, e.target.result);
        if (questions.length > 0) {
          this.examForm.patchValue({
            totalQuestions: questions.length
          });
        }
      } catch (error) {
        this.fileError = 'Error parsing file. Please check the template format.';
        console.error('File parsing error:', error);
      }
    };

    if (file.type === 'text/csv') {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  }

  private parseFileContent(file: File, content: string): QuestionTemplate[] {
    if (file.type === 'text/csv') {
      return this.parseCSV(content);
    } else {
      return this.parseExcel(content);
    }
  }

  private parseCSV(content: string): QuestionTemplate[] {
    const lines = content.split('\n');
    const questions: QuestionTemplate[] = [];
    let currentQuestion: QuestionTemplate | null = null;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const [text, type, subject, explanation, optionText, isCorrect] = line.split(',').map(s => s.trim());

      if (text && type && subject && explanation) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          text,
          type: type as 'single' | 'multiple' | 'true-false',
          subject,
          explanation,
          options: []
        };
      }

      if (currentQuestion && optionText) {
        currentQuestion.options.push({
          text: optionText,
          isCorrect: isCorrect.toLowerCase() === 'true'
        });
      }
    }

    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    return questions;
  }

  private parseExcel(content: string): QuestionTemplate[] {
    const workbook = XLSX.read(content, { type: 'binary' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const questions: QuestionTemplate[] = [];
    let currentQuestion: QuestionTemplate | null = null;

    data.forEach((row: any) => {
      if (row.text && row.type && row.subject && row.explanation) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          text: row.text,
          type: row.type as 'single' | 'multiple' | 'true-false',
          subject: row.subject,
          explanation: row.explanation,
          options: []
        };
      }

      if (currentQuestion && row.optionText) {
        currentQuestion.options.push({
          text: row.optionText,
          isCorrect: row.isCorrect === true || row.isCorrect === 'true'
        });
      }
    });

    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    return questions;
  }

  downloadTemplate(type: 'csv' | 'excel'): void {
    const headers = ['Text', 'Type', 'Subject', 'Explanation', 'Option Text', 'Is Correct'];
    const sampleData = [
      ['What is the capital of France?', 'single', 'Geography', 'Paris is the capital of France', 'Paris', 'true'],
      ['', '', '', '', 'London', 'false'],
      ['', '', '', '', 'Berlin', 'false'],
      ['Select all prime numbers:', 'multiple', 'Mathematics', 'Prime numbers are numbers greater than 1 that have no positive divisors other than 1 and themselves', '2', 'true'],
      ['', '', '', '', '3', 'true'],
      ['', '', '', '', '4', 'false'],
      ['The Earth is flat:', 'true-false', 'Science', 'The Earth is approximately spherical', 'True', 'false'],
      ['', '', '', '', 'False', 'true']
    ];

    if (type === 'csv') {
      const csv = [headers.join(',')].concat(sampleData.map(row => row.join(',')));
      const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'question_template.csv');
    } else {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Questions');
      XLSX.writeFile(wb, 'question_template.xlsx');
    }
  }

  onSubmit(): void {
    if (this.examForm.valid) {
      const examData = this.examForm.value;
      
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const questions = this.parseFileContent(this.selectedFile!, e.target.result);
            this.submitExamWithQuestions(examData, questions);
          } catch (error) {
            this.snackBar.open('Error processing questions file', 'Close', { duration: 3000 });
          }
        };

        if (this.selectedFile.type === 'text/csv') {
          reader.readAsText(this.selectedFile);
        } else {
          reader.readAsBinaryString(this.selectedFile);
        }
      } else {
        this.submitExamWithQuestions(examData, []);
      }
    }
  }

  private submitExamWithQuestions(examData: any, questions: QuestionTemplate[]): void {
    const request$ = this.isEditing ? 
      this.modelExamService.updateExam(this.data.id, examData, questions) :
      this.modelExamService.createExam(examData, questions);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          `Exam ${this.isEditing ? 'updated' : 'created'} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        console.error('Error saving exam:', error);
        this.snackBar.open('Failed to save exam', 'Close', { duration: 3000 });
      }
    });
  }

  /*onSubmit1(): void {
    if (this.examForm.valid) {
      const examData = this.examForm.value;
      
      const request$ = this.isEditing ? 
        this.modelExamService.updateExam(this.data.id, examData) :
        this.modelExamService.createExam(examData);

      request$.subscribe({
        next: () => {
          this.snackBar.open(
            `Exam ${this.isEditing ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error saving exam:', error);
          this.snackBar.open('Failed to save exam', 'Close', { duration: 3000 });
        }
      });
    }
  }*/
}
