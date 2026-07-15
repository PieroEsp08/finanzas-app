// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const { data } = await authService.getCurrentUser();

    if (data?.user) {
      return true;
    }
  } catch (error) {
    console.error('Error en el guardián de autenticación:', error);
  }

  router.navigate(['/auth']); 
  return false;
};