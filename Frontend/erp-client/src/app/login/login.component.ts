import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden px-4">
      
      <!-- Background Shapes (Decorative) -->
      <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style="animation-delay: 2s;"></div>
      
      <!-- Login Card -->
      <div class="relative w-full max-w-md z-10">
        <!-- Logo -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 mb-6 shadow-2xl shadow-indigo-500/40 transform transition-transform hover:scale-105 duration-300">
            <span class="text-4xl text-white">🏢</span>
          </div>
          <h1 class="text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">HRM System</h1>
          <p class="text-slate-400 mt-3 text-base font-medium">Hệ thống Quản lý Nhân sự Tối ưu</p>
        </div>

        <!-- Form Card (Glassmorphism) -->
        <div class="bg-slate-800/60 backdrop-blur-2xl rounded-3xl border border-slate-600/50 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.4)]">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-white">Đăng nhập</h2>
            <span class="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Admin Portal</span>
          </div>

          @if (errorMessage) {
            <div class="bg-rose-500/10 border border-rose-500/30 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3 animate-fadeIn">
              <span class="text-rose-400 mt-0.5">⚠️</span>
              <p class="text-rose-400 text-sm leading-relaxed">{{ errorMessage }}</p>
            </div>
          }

          <form (ngSubmit)="onLogin(user.value, pass.value)">
            <!-- Username -->
            <div class="mb-6 group">
              <label class="block text-sm font-semibold text-slate-300 mb-2.5 group-focus-within:text-indigo-400 transition-colors">Tài khoản</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors text-lg">👤</span>
                <input
                  type="text"
                  #user
                  name="username"
                  placeholder="Nhập tên đăng nhập bất kỳ..."
                  class="w-full bg-slate-900/50 border border-slate-600/50 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 shadow-inner"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="mb-8 group">
              <label class="block text-sm font-semibold text-slate-300 mb-2.5 group-focus-within:text-indigo-400 transition-colors">Mật khẩu</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors text-lg">🔒</span>
                <input
                  type="password"
                  #pass
                  name="password"
                  placeholder="Nhập mật khẩu bất kỳ..."
                  class="w-full bg-slate-900/50 border border-slate-600/50 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 shadow-inner"
                />
              </div>
            </div>

            <!-- Options -->
            <div class="flex items-center justify-between mb-8">
              <label class="flex items-center gap-3 cursor-pointer group">
                <div class="relative flex items-center justify-center">
                  <input type="checkbox" class="peer sr-only" />
                  <div class="w-5 h-5 rounded border-2 border-slate-500 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all"></div>
                  <svg class="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Ghi nhớ tôi</span>
              </label>
              <a class="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer hover:underline decoration-indigo-400/30 underline-offset-4">Quên mật khẩu?</a>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="isLoggingIn"
              class="relative overflow-hidden w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg py-4 px-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span class="relative z-10">{{ isLoggingIn ? 'Đang đăng nhập...' : 'Đăng nhập ngay' }}</span>
              <!-- Hover effect overlay -->
              <div class="absolute inset-0 h-full w-full bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          <!-- Footer -->
          <div class="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <p class="text-slate-400 text-sm">
              Tài khoản demo: <span class="text-white font-mono bg-slate-900/50 px-2 py-0.5 rounded">lam.nq</span> / <span class="text-white font-mono bg-slate-900/50 px-2 py-0.5 rounded">lam.nq</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out forwards;
    }
  `]
})
export class LoginComponent {
  errorMessage = '';

  private router = inject(Router);
  private authService = inject(AuthService);
  isLoggingIn = false;

  onLogin(usernameVal: string, passwordVal: string): void {
    // Validate
    if (!usernameVal.trim() || !passwordVal.trim()) {
      this.errorMessage = 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.';
      return;
    }

    this.isLoggingIn = true;
    this.errorMessage = '';

    this.authService.login(usernameVal, passwordVal).subscribe({
      next: () => {
        this.isLoggingIn = false;
        this.router.navigate(['/hr-dashboard']);
      },
      error: (err) => {
        this.isLoggingIn = false;
        this.errorMessage = err.error?.message || 'Tên đăng nhập hoặc mật khẩu không đúng.';
      }
    });
  }
}

