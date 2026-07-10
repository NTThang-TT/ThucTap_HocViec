import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Import Form Component vào
import { EmployeeFormComponent } from './employee-form/employee-form';

@Component({
  selector: 'app-root',
  standalone: true,
  // Thêm EmployeeFormComponent vào mảng imports
  imports: [RouterOutlet, EmployeeFormComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'week3-client';
}