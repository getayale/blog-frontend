
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return auth.getCurrentUser().pipe(
    map((response) => {
      if (response.user.role === 'ADMIN') {
        return true;
      }

      return router.createUrlTree(['/']);
    }),
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    })
  );
};
