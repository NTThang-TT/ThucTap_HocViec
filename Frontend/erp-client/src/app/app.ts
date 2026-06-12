import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true, // Không cần import thêm module hay router gì ở Tuần 1
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  // Biến tiêu đề để test nội suy (Interpolation)
  public title = 'Dự án Simple ERP - Tuần 1';

  // Khai báo một mảng dữ liệu tĩnh trực tiếp (Mock Data)
  public danhSach = [
    { id: 1, ten: 'Nguyen Van A', role: 'Backend Developer' },
    { id: 2, ten: 'Tran Thi B', role: 'Frontend Developer' },
    { id: 3, ten: 'Le Van C', role: 'AI Engineer' }
  ];
}