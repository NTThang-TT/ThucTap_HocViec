import { Component } from '@angular/core';

// Định nghĩa một Interface quản lý thông tin tiến độ (Kiến thức TypeScript)
interface ProjectProgress {
  name: string;
  currentWeek: number;
  techStack: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  // 1. Thuộc tính dùng cho Interpolation (Hiển thị chuỗi)
  public mainTitle = 'Hệ thống Quản lý Thực tập - Simple ERP';

  // 2. Đối tượng chứa dữ liệu chi tiết
  public progress: ProjectProgress = {
    name: 'Dự án Simple ERP',
    currentWeek: 1,
    techStack: 'Angular 21 + .NET 10'
  };

  // 3. Thuộc tính dùng cho Property Binding (Bật/Tắt nút bấm)
  public isProcessing = false;

  // 4. Hàm xử lý dùng cho Event Binding (Bắt sự kiện click)
  public giaTangTienDo(): void {
    this.progress.currentWeek++; // Mỗi lần bấm nút sẽ tăng số tuần lên 1

    if (this.progress.currentWeek >= 14) {
      alert('Chúc mừng! Bạn đã hoàn thành lộ trình thực tập 14 tuần!');
      this.isProcessing = true; // Vô hiệu hóa nút bấm khi đạt mục tiêu
    }
  }
}