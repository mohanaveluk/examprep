import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamData } from '../models/exam.model';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'api/exams'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  uploadExamData(examData: ExamData): Observable<any> {
    return this.http.post(this.apiUrl, examData);
  }

  processExcelFile(file: File): Promise<ExamQuestion[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          
          const questions = this.mapToQuestions(jsonData);
          resolve(questions);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  processCsvFile(file: File): Promise<ExamQuestion[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          try {
            const questions = this.mapToQuestions(results.data);
            resolve(questions);
          } catch (error) {
            reject(error);
          }
        },
        header: true,
        error: (error) => reject(error)
      });
    });
  }

  private mapToQuestions(data: any[]): ExamQuestion[] {
    return data.map(row => ({
      question: row.question,
      options: [row.option1, row.option2, row.option3, row.option4].filter(Boolean),
      correctAnswer: row.correctAnswer
    }));
  }
}