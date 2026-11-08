import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type {RegisterRequest,LoginRequest,CurrentUserResponse} from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(user: RegisterRequest) {
    return this.http.post(`${this.apiUrl}/register`, user, {
      withCredentials: true
    });
  }

  login(credentials: LoginRequest) {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      withCredentials: true
    });
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true
    });
  }

getCurrentUser() {
  return this.http.get<CurrentUserResponse>(`${this.apiUrl}/me`, {
    withCredentials: true
  });
}
}