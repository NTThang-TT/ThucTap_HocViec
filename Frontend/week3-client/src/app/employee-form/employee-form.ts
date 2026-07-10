import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
// 1. Bắt buộc: Import thêm thư viện Bảng của Ng-Zorro
import { NzTableModule } from 'ng-zorro-antd/table'; 

@Component({
  selector: 'app-employee-form',
  standalone: true,
  // 2. Thêm NzTableModule vào mảng imports
  imports: [ReactiveFormsModule, NzFormModule, NzInputModule, NzButtonModule, NzTableModule],
  templateUrl: './employee-form.html'
})
export class EmployeeFormComponent implements OnInit {
  public frmNhanSu!: FormGroup;
  // 3. Tạo một mảng rỗng để hứng dữ liệu từ C# gửi về
  public danhSachNhanSu: any[] = []; 

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.frmNhanSu = this.fb.group({
      ten: ['', [Validators.required, Validators.minLength(5)]],
      chucVu: ['', [Validators.required]]
    });
    
    // 4. Ngay khi trang web vừa mở, gọi API lấy danh sách ra xem luôn
    this.layDanhSachNhanSu(); 
  }

  // Hàm mới: Gọi [HttpGet] của C#
  layDanhSachNhanSu(): void {
    // Nhớ thay cổng 5104 thành cổng thực tế của máy bạn nếu khác nhé
    this.http.get<any[]>('http://localhost:5244/api/employees')
      .subscribe({
        next: (data) => {
          this.danhSachNhanSu = data; // Gán dữ liệu C# vào biến của Angular
        },
        error: (err) => console.error('Lỗi khi lấy danh sách', err)
      });
  }

  onSubmit(): void {
    if (this.frmNhanSu.valid) {
      // Gọi [HttpPost] để thêm mới
      this.http.post('http://localhost:5244/api/employees', this.frmNhanSu.value)
        .subscribe({
          next: (res) => {
            alert('Thêm nhân sự thành công!');
            this.frmNhanSu.reset(); 
            
            // 5. RẤT QUAN TRỌNG: Thêm xong thì phải gọi lại hàm lấy danh sách 
            // để bảng cập nhật luôn người mới mà không cần F5 lại trang web
            this.layDanhSachNhanSu(); 
          },
          error: (err) => alert('Lỗi kết nối API!')
        });
    } else {
      Object.values(this.frmNhanSu.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}