import { Component, OnInit } from '@angular/core';

// Định nghĩa khuôn mẫu dữ liệu
interface NhanVien { id: number; ten: string; role: string; }

@Component({
  selector: 'app-nhan-su',
  standalone: true,
  templateUrl: './nhan-su.html'
})
export class NhanSuComponent implements OnInit {
  public danhSach: NhanVien[] = [];
  public isLoading = true;

  // VÒNG ĐỜI (LIFECYCLE): Chạy tự động ngay khi mở Component
  ngOnInit(): void {
    setTimeout(() => {
      this.danhSach = [
        { id: 1, ten: 'Nguyễn Tất Thắng', role: 'Backend' },
        { id: 2, ten: 'Bảo Hân Nguyễn', role: 'AI' },
        { id: 3, ten: 'Trần Văn C', role: 'Intern' }
      ];
      this.isLoading = false; // Lấy xong dữ liệu thì tắt dòng chữ "Đang tải"
    }, 1500);
  }
}