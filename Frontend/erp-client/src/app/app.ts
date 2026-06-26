import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

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
            <div class="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="url(#logoGrad)"/>
                <path d="M8 10h12M8 14h8M8 18h10" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                    <stop stop-color="#818cf8"/>
                    <stop offset="1" stop-color="#6366f1"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="logo-text">
              <span class="logo-name">ERP System</span>
              <span class="logo-sub">Quản trị Doanh nghiệp</span>
            </div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section">
            <span class="nav-label">TỔNG QUAN</span>
            <a routerLink="/nhan-su" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
              <span>Quản lý Nhân Sự</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-label">HỆ THỐNG</span>
            <a class="nav-item disabled">
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M2 7h16" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </span>
              <span>Dự án</span>
              <span class="badge-soon">Sắp ra mắt</span>
            </a>
            <a class="nav-item disabled">
              <span class="nav-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 3v14h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M7 13l3-4 3 2 4-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span>Báo cáo</span>
              <span class="badge-soon">Sắp ra mắt</span>
            </a>
          </div>
        </nav>

        <div class="sidebar-footer">
          <div class="user-card">
            <div class="user-avatar">AD</div>
            <div class="user-info">
              <span class="user-name">Admin</span>
              <span class="user-role">Quản trị viên</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }

    /* ===== SIDEBAR ===== */
    .sidebar {
      width: 260px;
      background: rgba(22, 33, 62, 0.6);
      backdrop-filter: blur(20px);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 100;
      animation: slideInLeft 0.5s ease-out;
    }

    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .logo-name {
      font-size: 17px;
      font-weight: 700;
      background: linear-gradient(135deg, #a5b4fc, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.3px;
    }

    .logo-sub {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 400;
      letter-spacing: 0.3px;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      overflow-y: auto;
    }

    .nav-section {
      margin-bottom: 24px;
    }

    .nav-label {
      display: block;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 1.2px;
      padding: 0 12px;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all var(--transition-base);
      cursor: pointer;
      position: relative;
      margin-bottom: 2px;
    }

    .nav-item:hover:not(.disabled) {
      color: var(--text-primary);
      background: rgba(99, 102, 241, 0.08);
    }

    .nav-item.active {
      color: white;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.15));
      box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.2);
    }

    .nav-item.active .nav-icon {
      color: var(--primary-400);
    }

    .nav-item.disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .badge-soon {
      margin-left: auto;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 20px;
      background: rgba(245, 158, 11, 0.15);
      color: var(--accent-amber);
      font-weight: 500;
    }

    /* Footer */
    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid var(--border-subtle);
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border-radius: var(--radius-md);
      transition: background var(--transition-base);
    }

    .user-card:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 11px;
      color: var(--text-muted);
    }

    /* ===== MAIN CONTENT ===== */
    .main-content {
      flex: 1;
      margin-left: 260px;
      min-height: 100vh;
    }
  `]
})
export class AppComponent { }