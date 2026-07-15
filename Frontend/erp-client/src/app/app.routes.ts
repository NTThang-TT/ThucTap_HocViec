import { Routes } from '@angular/router';
import { NhanSuComponent } from './nhan-su/nhan-su';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Login — Lazy Loading
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },

  // HR Dashboard — Lazy Loading + authGuard bảo vệ
  {
    path: 'hr-dashboard',
    loadComponent: () => import('./hr-dashboard/hr-dashboard.component').then(m => m.HrDashboardComponent),
    canActivate: [authGuard]
  },



  // Route cũ (Tuần trước) — Giữ nguyên
  { path: 'nhan-su', component: NhanSuComponent },

  // Mặc định → chuyển hướng sang HR Dashboard
  { path: '', redirectTo: '/hr-dashboard', pathMatch: 'full' }
];