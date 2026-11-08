
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import type { RegisterRequest, AuthResponse } from '../../../models/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  registerForm;

  message = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth
  ) {
    this.registerForm = this.fb.nonNullable.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordsMatch
      }
    );
  }

  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    const { username, email, password } = this.registerForm.getRawValue();

    const userData: RegisterRequest = {
      username,
      email,
      password
    };

    this.auth.register(userData).subscribe({

      next: (response) => {
        const result = response as AuthResponse;

        this.message = result.message;
        this.isLoading = false;

        this.registerForm.reset();
      },

      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Registration failed. Please try again.';

        this.isLoading = false;
      }

    });
  }
}
