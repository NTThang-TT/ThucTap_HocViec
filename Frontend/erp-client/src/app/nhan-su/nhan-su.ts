import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NhanVienService } from '../services/nhan-vien.service';
import { NhanVien, NhanVienDto } from '../models/nhan-vien.model';

// ==========================================
// NG-ZORRO (Angular Ant Design) — UI Components
// ==========================================
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';

// ==========================================
// COMPONENT — Standalone + NG-ZORRO
// ==========================================

@Component({
  selector: 'app-nhan-su',
  standalone: true,
  imports: [
    CommonModule,
    // Angular — Forms
    ReactiveFormsModule,
    FormsModule,
    // NG-ZORRO — UI Components
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzTagModule,
    NzPopconfirmModule,
    NzSpinModule,
    NzTableModule,
    NzDatePickerModule,
    NzGridModule,
    NzSpaceModule
  ],
  templateUrl: './nhan-su.html',
  styleUrls: ['./nhan-su.scss']
})
export class NhanSuComponent implements OnInit {

  // SIGNALS — Quản lý state reactiv
  danhSach = signal<NhanVien[]>([]);
  isLoading = signal(true);
  showForm = signal(false);
  isEditing = signal(false);
  editingId = signal<number | null>(null);
  formErrors = signal<string[]>([]);
  
  // Bộ lọc
  selectedDepartment = signal<string>('All');

  // COMPUTED SIGNAL — Tự động tính lại khi danhSach() thay đổi
  
  // Lọc danh sách nhân viên: Chỉ lấy người "Active" hoặc "Busy" (chưa bị Soft Delete)
  // Và lọc theo phòng ban (nếu chọn)
  filteredDanhSach = computed(() => {
    let list = this.danhSach().filter(nv => nv.trang_thai !== 'inactive');
    
    if (this.selectedDepartment() !== 'All') {
      list = list.filter(nv => nv.department === this.selectedDepartment());
    }
    return list;
  });

  activeCount = computed(() =>
    this.filteredDanhSach().filter(nv => nv.trang_thai === 'active').length
  );
  
  totalCount = computed(() => this.filteredDanhSach().length);

  // ==========================================
  // REACTIVE FORM với VALIDATION (Thực tế HRM)
  // ==========================================
  nhanVienForm = new FormGroup({
    employeeCode: new FormControl('', [
      Validators.required,
    ]),
    fullName: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    phone: new FormControl('', [
      Validators.pattern('^[0-9]+$'), // Chỉ nhận số
      Validators.minLength(10),
      Validators.maxLength(11)
    ]),
    department: new FormControl('IT', [
      Validators.required
    ]),
    role: new FormControl('Backend Developer', [
      Validators.required
    ]),
    joinDate: new FormControl<Date | null>(new Date(), [
      Validators.required
    ]),
    trang_thai: new FormControl('active', [
      Validators.required
    ]),
  });

  // ==========================================
  // DEPENDENCY INJECTION
  // ==========================================
  private nhanVienService = inject(NhanVienService);
  private message = inject(NzMessageService);

  // ==========================================
  // LIFECYCLE
  // ==========================================
  ngOnInit(): void {
    this.loadData();
  }

  // ==========================================
  // CRUD METHODS
  // ==========================================

  /** GET — Lấy danh sách từ API (Employee Directory) */
  loadData(): void {
    this.isLoading.set(true);
    this.formErrors.set([]);

    this.nhanVienService.getAll().subscribe({
      next: (res) => {
        if (res.success) {
          this.danhSach.set(res.data ?? []);
        } else {
          this.message.error(res.message);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.message.error("Lỗi kết nối tới Server. Vui lòng bật backend.");
        this.isLoading.set(false);
      }
    });
  }

  /** POST — Tiếp nhận nhân sự mới (Onboarding) */
  onCreate(): void {
    if (this.nhanVienForm.invalid) {
      this.markFormDirty();
      return;
    }
    this.formErrors.set([]);
    const dto = this.prepareDto();

    this.nhanVienService.create(dto).subscribe(res => {
      if (res.success) {
        this.message.success(res.message);
        this.closeForm();
        this.loadData();
      } else {
        this.formErrors.set(res.errors);
      }
    });
  }

  /** PUT — Cập nhật hồ sơ (Promotion & Transfer) */
  onUpdate(): void {
    const id = this.editingId();
    if (!id) return;
    if (this.nhanVienForm.invalid) {
      this.markFormDirty();
      return;
    }
    this.formErrors.set([]);
    const dto = this.prepareDto();

    this.nhanVienService.update(id, dto).subscribe(res => {
      if (res.success) {
        this.message.success(res.message);
        this.closeForm();
        this.loadData();
      } else {
        this.formErrors.set(res.errors);
      }
    });
  }

  /** DELETE — Cho nghỉ việc (Soft Delete / Offboarding) */
  onDelete(nv: NhanVien): void {
    this.formErrors.set([]);

    this.nhanVienService.delete(nv.id).subscribe(res => {
      if (res.success) {
        this.message.success(res.message);
        this.loadData();
      } else {
        this.message.error(res.message);
      }
    });
  }

  // ==========================================
  // FORM HELPERS
  // ==========================================

  /** Mở form THÊM mới */
  openCreateForm(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.nhanVienForm.reset({
      employeeCode: '',
      fullName: '', 
      role: 'Backend Developer', 
      email: '', 
      phone: '',
      department: 'IT',
      joinDate: new Date(),
      trang_thai: 'active'
    });
    this.formErrors.set([]);
    this.showForm.set(true);
  }

  /** Mở form SỬA */
  openEditForm(nv: NhanVien): void {
    this.isEditing.set(true);
    this.editingId.set(nv.id);
    this.nhanVienForm.patchValue({
      employeeCode: nv.employeeCode,
      fullName: nv.fullName, 
      role: nv.role, 
      email: nv.email, 
      phone: nv.phone,
      department: nv.department,
      joinDate: nv.joinDate ? new Date(nv.joinDate) : new Date(),
      trang_thai: nv.trang_thai
    });
    this.formErrors.set([]);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.formErrors.set([]);
    this.nhanVienForm.reset();
  }

  onSubmit(): void {
    this.isEditing() ? this.onUpdate() : this.onCreate();
  }

  private markFormDirty() {
    Object.values(this.nhanVienForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }

  private prepareDto(): NhanVienDto {
    const formValue = this.nhanVienForm.value;
    return {
      employeeCode: formValue.employeeCode ?? '',
      fullName: formValue.fullName ?? '',
      email: formValue.email ?? '',
      phone: formValue.phone ?? '',
      department: formValue.department ?? '',
      role: formValue.role ?? '',
      joinDate: formValue.joinDate ? formValue.joinDate.toISOString() : new Date().toISOString(),
      trang_thai: formValue.trang_thai ?? 'active'
    };
  }

  // ==========================================
  // UI HELPERS
  // ==========================================
  
  onDepartmentFilterChange(value: string): void {
    this.selectedDepartment.set(value);
  }

  getInitials(name: string): string {
    if (!name) return 'NV';
    return name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
  }

  getAvatarColor(id: number): string {
    const colors = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#8b5cf6'];
    return colors[(id - 1) % colors.length];
  }
}