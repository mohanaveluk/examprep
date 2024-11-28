import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactForm } from './contact.model';
import { ApiUrlBuilder } from '../../shared/utility/api-url-builder';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://api.example.com/contact'; // Replace with your actual API endpoint

  constructor(private http: HttpClient, private apiUrlBuilder: ApiUrlBuilder) {}

  submitContactForm(formData: ContactForm): Observable<any> {
    const createApi = this.apiUrlBuilder.buildApiUrl('contact');
    return this.http.post(createApi, formData);
  }
}