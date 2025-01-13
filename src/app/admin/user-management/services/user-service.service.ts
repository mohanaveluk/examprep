import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role, User } from '../../../shared/models/auth.model';
import { ApiUrlBuilder } from '../../../shared/utility/api-url-builder';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient, 
    private apiUrlBuilder: ApiUrlBuilder) {}

  getUsers(): Observable<User[]> {
    const requestApi = this.apiUrlBuilder.buildApiUrl("auth/users")
    return this.http.get<User[]>(requestApi);
  }

  getRoles(): Observable<Role[]> {
    const requestApi = this.apiUrlBuilder.buildApiUrl("auth/roles")
    return this.http.get<Role[]>(requestApi);
  }

  updateUser(uguid: string, userData: Partial<User>): Observable<User> {
    const requestApi = this.apiUrlBuilder.buildApiUrl(`auth/${uguid}`)
    return this.http.put<User>(requestApi, userData);
  }

  toggleUserStatus(uguid: string, isActive: boolean): Observable<User> {
    const requestApi = this.apiUrlBuilder.buildApiUrl(`auth/${uguid}/status`)
    return this.http.patch<User>(requestApi, { isActive });
  }
}
