export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'AUTHOR' | 'READER';
}

export interface AuthResponse {
  message: string;
  user: User;
}