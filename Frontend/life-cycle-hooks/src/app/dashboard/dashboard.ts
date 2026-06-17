import { Component, OnInit } from '@angular/core';
import { Activity } from '../models';

@Component({
  selector: 'app-dashboard',
  standalone: true, // Standalone Component
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  // Data Binding: Biến giao tiếp với HTML
  public isLoading: boolean = true;
  public activities: Activity[] = [];

  // Component Lifecycle: Chạy khi Component khởi tạo
  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    // Giả lập gọi API từ Backend (chờ 1.5s)
    setTimeout(() => {
      this.activities = [
        { id: 3, name: "Đọc sách", category: "Study", score: 95 },
        { id: 1, name: "Học Angular", category: "Study", score: 90 },
        { id: 4, name: "Ngủ", category: "Rest", score: 70 }
      ];
      this.isLoading = false;
    }, 1500);
  }
}