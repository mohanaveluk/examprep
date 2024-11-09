import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactForm } from './contact.model';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://api.example.com/contact'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  submitContactForm(formData: ContactForm): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}