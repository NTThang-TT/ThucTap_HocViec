import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';

// Routing: Điều hướng trang web
export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
  
];