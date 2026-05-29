import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Định nghĩa khuôn mẫu giống hệt Record bên C#
interface Employee {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
})
export class AppComponent implements OnInit {
  public title = 'Danh sách nhân sự (Dữ liệu từ .NET 10)';
  public employees: Employee[] = [];
  
  // Tiêm (Inject) công cụ gọi HTTP
  private http = inject(HttpClient);

  // Hàm ngOnInit tự động chạy ngay khi giao diện vừa load xong
  ngOnInit(): void {
    // Gọi API sang cổng 5000 của C#
    this.http.get<Employee[]>('http://localhost:5000/api/employees')
      .subscribe({
        next: (data) => {
          this.employees = data; // Gán dữ liệu trả về vào biến
        },
        error: (err) => {
          console.error('Lỗi kết nối Backend:', err);
        }
      });
  }
}