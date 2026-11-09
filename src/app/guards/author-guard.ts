import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { DatePipe, SlicePipe } from '@angular/common';

export const authorGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    auth.getCurrentUser().subscribe({
      next: (response) => {
        if (response.user.role === 'AUTHOR') {
          resolve(true);
        } else {
          router.navigate(['/']);
          resolve(false);
        }
      },
      error: () => {
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};