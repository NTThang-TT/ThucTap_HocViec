import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <div class="logo-icon">📊</div>
            <div class="logo-text">
              <span class="logo-name">ERP System</span>
              <span class="logo-sub">Quản trị Doanh nghiệp</span>
            </div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <span class="nav-label">TUẦN 5</span>
          <a routerLink="/hr-dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📊</span>
            <span>HR Dashboard</span>
          </a>

          <span class="nav-label" style="margin-top: 12px;">TUẦN TRƯỚC</span>
          <a routerLink="/nhan-su" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👥</span>
            <span>Nhân Sự (cũ)</span>
          </a>
          <a class="nav-item disabled">
            <span class="nav-icon">📁</span>
            <span>Dự án</span>
            <span class="badge-soon">Sắp có</span>
          </a>
          <a class="nav-item disabled">
            <span class="nav-icon">📈</span>
            <span>Báo cáo</span>
            <span class="badge-soon">Sắp có</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-card">
            <div class="user-avatar">AD</div>
            <div class="user-info">
              <span class="user-name">Admin</span>
              <span class="user-role">Quản trị viên</span>
            </div>
          </div>
          <button class="logout-btn" (click)="onLogout()">🚪 Đăng xuất</button>
        </div>
      </aside>

      <!-- Mobile Header -->
      <header class="mobile-header">
        <div class="logo-icon">📊</div>
        <span class="logo-name">ERP System</span>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout { display: flex; min-height: 100vh; }

    /* SIDEBAR */
    .sidebar {
      width: 240px;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0; left: 0; bottom: 0;
      z-index: 100;
      animation: slideInLeft 0.4s ease;
    }

    .sidebar-header {
      padding: 20px 16px;
      border-bottom: 1px solid var(--border-light);
    }

    .logo { display: flex; align-items: center; gap: 10px; }
    .logo-icon { font-size: 24px; }
    .logo-text { display: flex; flex-direction: column; }
    .logo-name { font-size: 15px; font-weight: 700; color: var(--primary-600); }
    .logo-sub { font-size: 11px; color: var(--text-muted); }

    .sidebar-nav { flex: 1; padding: 12px 8px; }

    .nav-label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 1px;
      padding: 0 12px;
      margin-bottom: 6px;
    }

    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13.5px; font-weight: 500;
      transition: all var(--transition-fast);
      cursor: pointer;
      margin-bottom: 2px;
    }
    .nav-item:hover:not(.disabled) { background: var(--primary-50); color: var(--primary-600); }
    .nav-item.active {
      background: var(--primary-50);
      color: var(--primary-600);
      font-weight: 600;
    }
    .nav-item.disabled { opacity: 0.4; cursor: not-allowed; }
    .nav-icon { font-size: 16px; width: 20px; text-align: center; }
    .badge-soon {
      margin-left: auto;
      font-size: 9px; padding: 2px 6px;
      border-radius: 10px;
      background: #fef3c7; color: #b45309;
      font-weight: 600;
    }

    /* Footer */
    .sidebar-footer { padding: 12px; border-top: 1px solid var(--border-light); }
    .user-card { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: var(--radius-md); }
    .user-avatar {
      width: 32px; height: 32px; border-radius: 8px;
      background: linear-gradient(135deg, var(--primary-400), var(--primary-500));
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700; color: white;
    }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-size: 12px; font-weight: 600; color: var(--text-primary); }
    .user-role { font-size: 10px; color: var(--text-muted); }

    .logout-btn {
      width: 100%;
      margin-top: 8px;
      padding: 8px 12px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .logout-btn:hover {
      background: #fef2f2;
      color: #ef4444;
      border-color: #fecaca;
    }

    /* Main */
    .main-content { flex: 1; margin-left: 240px; min-height: 100vh; }

    /* Mobile Header */
    .mobile-header {
      display: none;
      position: fixed; top: 0; left: 0; right: 0;
      height: 56px;
      background: white;
      border-bottom: 1px solid var(--border-color);
      align-items: center; gap: 8px;
      padding: 0 16px;
      z-index: 90;
      box-shadow: var(--shadow-sm);
    }
    .mobile-header .logo-icon { font-size: 20px; }
    .mobile-header .logo-name { font-size: 15px; font-weight: 700; color: var(--primary-600); }

    @media (max-width: 768px) {
      .sidebar { display: none; }
      .mobile-header { display: flex; }
      .main-content { margin-left: 0; padding-top: 56px; }
    }
  `]
})
export class AppComponent {
  private router = inject(Router);

  onLogout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }
}