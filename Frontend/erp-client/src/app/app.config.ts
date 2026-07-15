import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

// ==========================================
// NG-ZORRO i18n — Ngôn ngữ tiếng Việt
// ==========================================
import { vi_VN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';

registerLocaleData(vi);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])  // ← Đăng ký các interceptors
    ),
    provideAnimationsAsync(),   // ← Bắt buộc cho NG-ZORRO animations
    provideNzI18n(vi_VN)        // ← Chuyển DatePicker, Table, v.v. sang Tiếng Việt
  ]
};
