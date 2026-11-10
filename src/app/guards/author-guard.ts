import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';

export const authorGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const currentUser = auth.currentUser();

  if (!currentUser) {
    return router.createUrlTree(['/login']);
  }

  if (currentUser.role === 'AUTHOR') {
    return true;
  }

  return router.createUrlTree(['/']);
};