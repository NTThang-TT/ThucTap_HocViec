// import { Component, OnInit, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// // Định nghĩa khuôn mẫu giống hệt Record bên C#
// interface Employee {
//   id: number;
//   name: string;
//   role: string;
// }

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   templateUrl: './app.html',
// })
// export class AppComponent implements OnInit {
//   public title = 'Danh sách nhân sự (Dữ liệu từ .NET 10)';
//   public employees: Employee[] = [];

//   // Tiêm (Inject) công cụ gọi HTTP
//   private http = inject(HttpClient);

//   // Hàm ngOnInit tự động chạy ngay khi giao diện vừa load xong
//   ngOnInit(): void {
//     // Gọi API sang cổng 5000 của C#
//     this.http.get<Employee[]>('http://localhost:5000/api/employees')
//       .subscribe({
//         next: (data) => {
//           this.employees = data; // Gán dữ liệu trả về vào biến
//         },
//         error: (err) => {
//           console.error('Lỗi kết nối Backend:', err);
//         }
//       });
//   }
// }

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], // Cần cái này để chạy Routing
  template: `
    <div style="padding: 20px; font-family: Arial;">
      <h2>Hệ thống Quản trị</h2>
      
      <nav style="margin-bottom: 20px;">
        <a routerLink="/nhan-su" style="padding: 10px 15px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">
          Quản lý Nhân Sự
        </a>
      </nav>

      <hr style="margin-bottom: 20px;">
      
      <router-outlet></router-outlet> 
    </div>
  `
})
export class AppComponent { }