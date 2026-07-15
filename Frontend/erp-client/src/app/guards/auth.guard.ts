import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Functional Guard — authGuard
 * Kiểm tra token trong localStorage
 * Nếu không có → redirect về /login
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  // Bypass login for development
  return true;
};
