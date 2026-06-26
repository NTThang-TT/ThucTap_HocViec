import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NhanVienService } from '../services/nhan-vien.service';
import { NhanVien, NhanVienDto } from '../models/nhan-vien.model';

// ==========================================
// CONTROLLER — Xử lý logic CRUD
// ==========================================

@Component({
  selector: 'app-nhan-su',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nhan-su.html',
  styleUrls: ['./nhan-su.scss']
})
export class NhanSuComponent implements OnInit {
  // === STATE ===
  danhSach: NhanVien[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  // === FORM STATE ===
  showForm = false;
  isEditing = false;
  editingId: number | null = null;

  // Form data (two-way binding với [(ngModel)])
  formData: NhanVienDto = {
    ten: '',
    role: 'Backend Developer',
    email: '',
    trang_thai: 'active'
  };
  formErrors: string[] = [];

  // Confirm delete
  deletingNv: NhanVien | null = null;

  // === INJECT SERVICE ===
  private nhanVienService = inject(NhanVienService);

  // === LIFECYCLE: Load dữ liệu khi mở trang ===
  ngOnInit(): void {
    this.loadData();
  }

  // === CRUD METHODS ===

  /** GET — Lấy danh sách từ API */
  loadData(): void {
    this.isLoading = true;
    this.clearMessages();

    this.nhanVienService.getAll().subscribe(res => {
      if (res.success) {
        this.danhSach = res.data ?? [];
      } else {
        this.errorMessage = res.message;
        this.formErrors = res.errors;
      }
      this.isLoading = false;
    });
  }

  /** POST — Thêm nhân viên mới */
  onCreate(): void {
    this.clearMessages();
    this.formErrors = [];

    this.nhanVienService.create(this.formData).subscribe(res => {
      if (res.success) {
        this.successMessage = res.message;
        this.closeForm();
        this.loadData();
      } else {
        this.formErrors = res.errors;
      }
    });
  }

  /** PUT — Cập nhật nhân viên */
  onUpdate(): void {
    if (!this.editingId) return;
    this.clearMessages();
    this.formErrors = [];

    this.nhanVienService.update(this.editingId, this.formData).subscribe(res => {
      if (res.success) {
        this.successMessage = res.message;
        this.closeForm();
        this.loadData();
      } else {
        this.formErrors = res.errors;
      }
    });
  }

  /** DELETE — Xóa nhân viên */
  onDelete(nv: NhanVien): void {
    this.clearMessages();

    this.nhanVienService.delete(nv.id).subscribe(res => {
      if (res.success) {
        this.successMessage = res.message;
        this.loadData();
      } else {
        this.errorMessage = res.message;
      }
      this.deletingNv = null;
    });
  }

  // === FORM HELPERS ===

  /** Mở form THÊM mới */
  openCreateForm(): void {
    this.isEditing = false;
    this.editingId = null;
    this.formData = { ten: '', role: 'Backend Developer', email: '', trang_thai: 'active' };
    this.formErrors = [];
    this.showForm = true;
  }

  /** Mở form SỬA */
  openEditForm(nv: NhanVien): void {
    this.isEditing = true;
    this.editingId = nv.id;
    this.formData = { ten: nv.ten, role: nv.role, email: nv.email, trang_thai: nv.trang_thai };
    this.formErrors = [];
    this.showForm = true;
  }

  /** Đóng form */
  closeForm(): void {
    this.showForm = false;
    this.formErrors = [];
  }

  /** Submit form (tạo hoặc sửa) */
  onSubmit(): void {
    this.isEditing ? this.onUpdate() : this.onCreate();
  }

  /** Mở confirm xóa */
  confirmDelete(nv: NhanVien): void {
    this.deletingNv = nv;
  }

  /** Hủy xóa */
  cancelDelete(): void {
    this.deletingNv = null;
  }

  /** Xóa messages */
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  /** Lấy chữ cái đầu tên */
  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
  }

  /** Màu avatar theo ID */
  getAvatarColor(id: number): string {
    const colors = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4', '#8b5cf6'];
    return colors[(id - 1) % colors.length];
  }

  /** Đếm nhân viên đang active */
  getActiveCount(): number {
    return this.danhSach.filter(nv => nv.trang_thai === 'active').length;
  }
}