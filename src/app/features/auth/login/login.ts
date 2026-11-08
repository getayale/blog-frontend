
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../../../services/auth';
import type { AuthResponse } from '../../../models/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  userRole = '';
  loginForm;

  message = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    this.auth.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        const result = response as AuthResponse;

        this.message = result.message;
        this.userRole = result.user.role;

        this.isLoading = false;

        if (this.userRole === 'READER') {
          this.router.navigate(['/reader-dashboard']);
        }
        else if (this.userRole === 'AUTHOR') {
          this.router.navigate(['/author-dashboard']);
        }
        else if (this.userRole === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        }
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Login failed. Please try again.';

        this.isLoading = false;
      }
    });
  }
}
