import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  const currentUser = auth.currentUser();

  if (!currentUser) {
    return router.createUrlTree(['/login']);
  }

  if (currentUser.role === 'ADMIN') {
    return true;
  }

  return router.createUrlTree(['/']);
};