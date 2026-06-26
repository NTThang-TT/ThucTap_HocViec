import { Component, OnInit } from '@angular/core';

// Định nghĩa khuôn mẫu dữ liệu
interface NhanVien {
  id: number;
  ten: string;
  role: string;
  email: string;
  trangThai: 'active' | 'busy' | 'offline';
}

@Component({
  selector: 'app-nhan-su',
  standalone: true,
  templateUrl: './nhan-su.html',
  styleUrls: ['./nhan-su.scss']
})
export class NhanSuComponent implements OnInit {
  public danhSach: NhanVien[] = []; //generic
  public isLoading = true;

  // Stats cho dashboard
  public totalNhanVien = 0;
  public activeCount = 0;
  public roleStats: { [key: string]: number } = {};

  // VÒNG ĐỜI (LIFECYCLE): Chạy tự động ngay khi mở Component
  ngOnInit(): void {
    setTimeout(() => {
      this.danhSach = [
        { id: 1, ten: 'Nguyễn Tất Thắng', role: 'Backend', email: 'thang.nt@erp.vn', trangThai: 'active' },
        { id: 2, ten: 'Bảo Hân Nguyễn', role: 'AI', email: 'han.nb@erp.vn', trangThai: 'active' },
        { id: 3, ten: 'Trần Văn C', role: 'Intern', email: 'c.tv@erp.vn', trangThai: 'busy' },
        { id: 4, ten: 'Lê Thị D', role: 'Frontend', email: 'd.lt@erp.vn', trangThai: 'active' },
        { id: 5, ten: 'Phạm Minh E', role: 'Backend', email: 'e.pm@erp.vn', trangThai: 'offline' },
        { id: 6, ten: 'Hoàng Văn F', role: 'DevOps', email: 'f.hv@erp.vn', trangThai: 'active' },
      ];

      this.totalNhanVien = this.danhSach.length;
      this.activeCount = this.danhSach.filter(nv => nv.trangThai === 'active').length;

      // Tính số lượng theo role
      this.danhSach.forEach(nv => {
        this.roleStats[nv.role] = (this.roleStats[nv.role] || 0) + 1;
      });

      this.isLoading = false; // Lấy xong dữ liệu thì tắt dòng chữ "Đang tải"
    }, 1500);
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
  }

  getAvatarGradient(id: number): string {
    const gradients = [
      'linear-gradient(135deg, #6366f1, #8b5cf6)',
      'linear-gradient(135deg, #10b981, #06b6d4)',
      'linear-gradient(135deg, #f43f5e, #f97316)',
      'linear-gradient(135deg, #f59e0b, #ef4444)',
      'linear-gradient(135deg, #06b6d4, #3b82f6)',
      'linear-gradient(135deg, #8b5cf6, #ec4899)',
    ];
    return gradients[(id - 1) % gradients.length];
  }
}