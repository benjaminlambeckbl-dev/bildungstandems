// =============================================================
// BildungsTandems – Route-Guards
// authGuard: nur angemeldet. rolleGuard: nur passende Rolle.
// =============================================================

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Rolle } from '../models/models';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.istAngemeldet()) return true;
  return router.createUrlTree(['/login']);
};

export function rolleGuard(rolle: Rolle): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const aktuelle = auth.rolle();
    if (!aktuelle) return router.createUrlTree(['/login']);
    if (aktuelle === rolle) return true;
    // falsche Rolle → auf eigenen Bereich umleiten
    return router.createUrlTree([auth.startRoute(aktuelle)]);
  };
}
