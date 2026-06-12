import { Component, signal } from '@angular/core';
// Import ParentComponent (đường dẫn có thể khác tùy cách bạn đặt tên class)
import { Parent } from './components/parent/parent'; 

@Component({
  selector: 'app-root',
  // Xóa RouterOutlet, thêm Parent vào đây
  imports: [Parent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('life-cycle-hooks');
}