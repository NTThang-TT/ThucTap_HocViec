// ==========================================
// MODEL LAYER — Định nghĩa kiểu dữ liệu
// ==========================================

/**
 * Interface Nhân Viên — khuôn mẫu dữ liệu chính
 */
export interface NhanVien {
  id: number;
  ten: string;
  role: string;
  email: string;
  trang_thai: 'active' | 'busy' | 'offline';
}

/**
 * DTO (Data Transfer Object) — Dữ liệu gửi lên khi tạo/sửa
 * Không có id vì server tự tạo
 */
export interface NhanVienDto {
  ten: string;
  role: string;
  email: string;
  trang_thai: string;
}

/**
 * === API RESPONSE CHUẨN ===
 * Generic<T> — T là kiểu dữ liệu trả về
 *
 * Thành công: { success: true,  data: [...], message: "OK", errors: [] }
 * Lỗi:       { success: false, data: null,  message: "Lỗi", errors: ["..."] }
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors: string[];
}
