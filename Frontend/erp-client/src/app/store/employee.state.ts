import { Injectable, inject, signal, computed } from '@angular/core';
import { EmployeeDTO } from '../models/employee-dto.model';
import { EmployeeService } from '../services/employee.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeStateService {
  private employeeService = inject(EmployeeService);


  // STATE (Tín hiệu trạng thái)

  private _employees = signal<EmployeeDTO[]>([]);
  private _isLoading = signal<boolean>(false);
  private _errorMessage = signal<string>('');


  // SELECTORS (Tín hiệu chỉ đọc & Tính toán)
  public readonly employees = this._employees.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly errorMessage = this._errorMessage.asReadonly();

  // Thống kê tự động cập nhật khi _employees thay đổi
  public readonly totalCount = computed(() => this._employees().length);
  
  public readonly activeCount = computed(() => 
    this._employees().filter(e => e.status === 'Đang hoạt động').length
  );
  
  public readonly onLeaveCount = computed(() => 
    this._employees().filter(e => e.status === 'Nghỉ phép').length
  );
  
  public readonly inactiveCount = computed(() => 
    this._employees().filter(e => e.status === 'Đã nghỉ việc').length
  );

  public readonly uniqueDepartments = computed(() => {
    const deps = this._employees()
      .map(e => e.departmentName)
      .filter((dept, index, self) => dept && self.indexOf(dept) === index);
    return deps.sort();
  });


  // ACTIONS (Hành động cập nhật trạng thái)

  public loadEmployees(): void {
    this._isLoading.set(true);
    this._errorMessage.set('');

    this.employeeService.getAll().subscribe({
      next: (data) => {
        this._employees.set(data);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('API Error:', err);
        this._errorMessage.set('Lỗi kết nối tới Server. Hãy chắc chắn Backend đang chạy (dotnet run).');
        this._isLoading.set(false);
      }
    });
  }

  // Reload data after an action
  public refreshData(): void {
    this.loadEmployees();
  }
}
