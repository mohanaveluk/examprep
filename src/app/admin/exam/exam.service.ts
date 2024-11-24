import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamData, ExamQuestion, QuestionType } from './models/exam.model';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import { AdminExam } from './examlist.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'api/exams'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  
  createExam(exam: Partial<AdminExam>): Observable<AdminExam> {
    return this.http.post<AdminExam>(this.apiUrl, exam);
  }

  updateExam(exam: Partial<AdminExam>): Observable<AdminExam> {
    return this.http.put<AdminExam>(`${this.apiUrl}/${exam.id}`, exam);
  }
  
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
    // return data.map(row => ({
    //   question: row.question,
    //   options: [row.option1, row.option2, row.option3, row.option4, row.option5].filter(Boolean),
    //   correctAnswer: row.correctAnswer
    // }));

    return data.map(row => {
      const type = this.determineQuestionType(row);
      
      switch (type) {
        case QuestionType.TRUE_FALSE:
          return this.mapTrueFalseQuestion(row);
        case QuestionType.ORDERING:
          return this.mapOrderingQuestion(row);
        default:
          return this.mapMultipleChoiceQuestion(row);
      }
    });

  }

  private determineQuestionType(row: any): QuestionType {
    if (row.type?.toLowerCase() === 'true/false') {
      return QuestionType.TRUE_FALSE;
    }
    if (row.type?.toLowerCase() === 'ordering') {
      return QuestionType.ORDERING;
    }
    return row.correctAnswers?.includes(',') ? 
      QuestionType.MULTIPLE_CHOICE : 
      QuestionType.SINGLE_CHOICE;
  }

  private mapMultipleChoiceQuestion(row: any): ExamQuestion {
    const options = [
      row.option1, 
      row.option2, 
      row.option3, 
      row.option4, 
      row.option5
    ].filter(Boolean);

    const correctAnswers = row.correctAnswers
      ?.split(',')
      .map((answer: string) => answer.trim())
      .filter(Boolean) || [];

    return {
      question: row.question,
      options,
      correctAnswers,
      type: correctAnswers.length > 1 ? 
        QuestionType.MULTIPLE_CHOICE : 
        QuestionType.SINGLE_CHOICE
    };
  }

  private mapTrueFalseQuestion(row: any): ExamQuestion {
    return {
      question: row.question,
      options: ['True', 'False'],
      correctAnswers: [row.correctAnswers?.toString()],
      type: QuestionType.TRUE_FALSE
    };
  }

  private mapOrderingQuestion(row: any): ExamQuestion {
    const options = [
      row.option1, 
      row.option2, 
      row.option3, 
      row.option4, 
      row.option5
    ].filter(Boolean);

    const order = row.order
      ?.split(',')
      .map((num: string) => parseInt(num.trim()))
      .filter((num: number) => !isNaN(num));

    return {
      question: row.question,
      options,
      correctAnswers: order.map((i: number) => options[i - 1]),
      type: QuestionType.ORDERING,
      order
    };
  }
  
}