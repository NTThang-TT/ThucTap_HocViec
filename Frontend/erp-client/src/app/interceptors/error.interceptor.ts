import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 500) {
        // Lỗi hệ thống toàn cục từ ExceptionHandlingMiddleware
        console.error('Lỗi 500 từ Server:', error.error);
        alert(`Lỗi hệ thống: ${error.error?.message || 'Có lỗi xảy ra'}\nChi tiết: ${error.error?.details || ''}`);
      }

      return throwError(() => error);
    })
  );
};
