import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Thêm token vào Header
  let authReq = req;
  const token = authService.getToken();
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Bắt lỗi 401 Unauthorized
      if (error.status === 401 && !req.url.includes('auth/login')) {
        if (!isRefreshing) {
          isRefreshing = true;

          // Cố gắng xin cấp lại token
          return authService.refreshToken().pipe(
            switchMap((res: any) => {
              isRefreshing = false;
              // Nếu thành công, tự động gọi lại Request ban đầu với Token mới
              const newToken = res.token;
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(newReq);
            }),
            catchError((refreshErr) => {
              // Refresh Token cũng chết -> Đá ra trang login
              isRefreshing = false;
              authService.logout();
              router.navigate(['/login']);
              return throwError(() => refreshErr);
            })
          );
        }
      } else if (error.status === 403) {
        alert('Bạn không có quyền thực hiện chức năng này!');
      }

      return throwError(() => error);
    })
  );
};
