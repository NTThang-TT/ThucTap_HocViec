// import { Component, signal } from '@angular/core';
// // Import ParentComponent (đường dẫn có thể khác tùy cách bạn đặt tên class)
// import { Parent } from './components/parent/parent'; 
// import { DashboardComponent } from './dashboard/dashboard';
// @Component({
//   selector: 'app-root',
//   // Xóa RouterOutlet, thêm Parent vào đây
//   imports: [Parent, DashboardComponent], 
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App {
//   protected readonly title = signal('life-cycle-hooks');
// }

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// 1. Phải import đủ cả Parent (bài cũ) và Dashboard (bài mới)
import { Parent} from './components/parent/parent'; // (Đường dẫn này tùy vào file của bạn)
import { DashboardComponent } from './dashboard/dashboard'; 

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. Mảng imports PHẢI CÓ đủ cả 2 component này
  imports: [RouterOutlet, Parent, DashboardComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'life-cycle-hooks';
}