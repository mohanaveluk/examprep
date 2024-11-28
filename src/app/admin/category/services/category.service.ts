import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category.model';
import { ApiUrlBuilder } from '../../../shared/utility/api-url-builder';

const mockCategory: Category[] = [
  {
    id: '1',
    name: "Nurse",
    description: "Nurse",
    createdAt: new Date("11/08/2024")
  },
  {
    id: '2',
    name: "Medicine",
    description: "Medicine",
    createdAt: new Date("11/16/2024")
  },
  {
    id: '3',
    name: "Dental",
    description: "Dental",
    createdAt: new Date("11/12/2024")
  },
  {
    id: '4',
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

  constructor(private http: HttpClient, private apiUrlBuilder: ApiUrlBuilder) {}

  getCategories(): Observable<Category[]> {
    const createApi = this.apiUrlBuilder.buildApiUrl('categories');
    return this.http.get<Category[]>(createApi);
    //return of(mockCategory);
  }

  addCategory(category: Omit<Category, 'id'>): Observable<Category> {
    const createApi = this.apiUrlBuilder.buildApiUrl('categories');
    return this.http.post<Category>(createApi, category);

    /*let cat = {
      ...category,
      id: mockCategory.length+1,
    }
    mockCategory.push(cat);
    return of(cat);*/
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    const updateApi = this.apiUrlBuilder.buildApiUrl('categories');
    return this.http.put<Category>(`${updateApi}/${id}`, category);
    //mockCategory.push(category as Category);
  }

  deleteCategory(id: string): Observable<void> {
    const updateApi = this.apiUrlBuilder.buildApiUrl('categories');
    return this.http.delete<void>(`${updateApi}/${id}`);
  }
}