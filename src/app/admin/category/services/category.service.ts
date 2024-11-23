import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category.model';

const mockCategory: Category[] = [
  {
    id: 1,
    name: "Nurse",
    description: "Nurse",
    createdAt: new Date("11/08/2024")
  },
  {
    id: 2,
    name: "Medicine",
    description: "Medicine",
    createdAt: new Date("11/16/2024")
  },
  {
    id: 3,
    name: "Dental",
    description: "Dental",
    createdAt: new Date("11/12/2024")
  },
  {
    id: 4,
    name: "Vision",
    description: "Vision",
    createdAt: new Date("11/11/2024")
  }
]

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'api/categories'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    //return this.http.get<Category[]>(this.apiUrl);
    return of(mockCategory);
  }

  addCategory(category: Omit<Category, 'id'>): Observable<Category> {
    let cat = {
      ...category,
      id: mockCategory.length+1,
    }
    mockCategory.push(cat);
    //return this.http.post<Category>(this.apiUrl, category);
    return of(cat);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    mockCategory.push(category as Category);
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}