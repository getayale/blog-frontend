import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type {RegisterRequest,LoginRequest,CurrentUserResponse} from '../models/auth';

import type { User } from '../models/auth';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class Auth {

 private apiUrl = `${environment.apiUrl}/auth`;
 
   currentUser=signal<User | null>(null);
   isAuthenticated=computed(()=>this.currentUser()!==null);

   setCurrentUser(user:User){
    this.currentUser.set(user);
   }

   clearCurrentUser(){
    this.currentUser.set(null);
   }

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

initializeAuth(): Promise<void> {
  return new Promise((resolve) => {
    this.getCurrentUser().subscribe({
      next: (response) => {
        this.currentUser.set(response.user);
        resolve();
      },
      error: () => {
        this.clearCurrentUser();
        resolve();
      }
    });
  });
}
}

