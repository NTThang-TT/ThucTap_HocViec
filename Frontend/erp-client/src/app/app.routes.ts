import { Routes } from '@angular/router';
import { NhanSuComponent } from './nhan-su/nhan-su';

export const routes: Routes = [
  // Khi người dùng vào link /nhan-su thì mở NhanSuComponent
  { path: 'nhan-su', component: NhanSuComponent },
  // Mặc định vừa vào web sẽ tự động chuyển hướng sang /nhan-su
  { path: '', redirectTo: '/nhan-su', pathMatch: 'full' }
];