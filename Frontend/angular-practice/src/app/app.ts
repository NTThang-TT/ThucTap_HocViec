import { Component } from '@angular/core';

// Định nghĩa cấu trúc nhân viên
interface Employee {
  id: number;
  name: string;
  role: string;
  isActive: boolean; // Trạng thái làm việc
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html'
})
export class AppComponent {
  public title = 'Control Flow';

  // Dữ liệu giả (Mock data) ngay tại Frontend
  public employees: Employee[] = [
    { id: 1, name: "Nguyễn Văn A", role: "Backend Developer", isActive: true },
    { id: 2, name: "Trần Thị B", role: "Frontend Developer", isActive: true },
    { id: 3, name: "Lê Văn C", role: "Intern", isActive: false }
  ];
}