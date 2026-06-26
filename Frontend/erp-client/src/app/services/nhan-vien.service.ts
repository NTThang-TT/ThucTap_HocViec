import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ApiResponse, NhanVien, NhanVienDto } from '../models/nhan-vien.model';

// ==========================================
// SERVICE LAYER — Kết nối API
// ==========================================

@Injectable({ providedIn: 'root' })
export class NhanVienService {
  // URL của Python API server
  private apiUrl = 'http://localhost:5000/api/nhan-vien';

  // Inject HttpClient (công cụ gọi HTTP)
  private http = inject(HttpClient);

  /**
   * GET — Lấy tất cả nhân viên
   * Tương đương C#: await _context.Employees.ToListAsync()
   */
  getAll(): Observable<ApiResponse<NhanVien[]>> {
    return this.http
      .get<ApiResponse<NhanVien[]>>(this.apiUrl)
      .pipe(catchError(this.handleError<NhanVien[]>('Lỗi khi lấy danh sách nhân viên')));
  }

  /**
   * GET — Lấy 1 nhân viên theo ID
   * Tương đương C#: await _context.Employees.FindAsync(id)
   */
  getById(id: number): Observable<ApiResponse<NhanVien>> {
    return this.http
      .get<ApiResponse<NhanVien>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError<NhanVien>('Lỗi khi lấy thông tin nhân viên')));
  }

  /**
   * POST — Thêm nhân viên mới
   * Tương đương C#: _context.Employees.Add(newEmp); await _context.SaveChangesAsync()
   */
  create(dto: NhanVienDto): Observable<ApiResponse<NhanVien>> {
    return this.http
      .post<ApiResponse<NhanVien>>(this.apiUrl, dto)
      .pipe(catchError(this.handleError<NhanVien>('Lỗi khi thêm nhân viên')));
  }

  /**
   * PUT — Cập nhật nhân viên
   * Tương đương C#: _context.Entry(emp).State = Modified; await SaveChangesAsync()
   */
  update(id: number, dto: NhanVienDto): Observable<ApiResponse<NhanVien>> {
    return this.http
      .put<ApiResponse<NhanVien>>(`${this.apiUrl}/${id}`, dto)
      .pipe(catchError(this.handleError<NhanVien>('Lỗi khi cập nhật nhân viên')));
  }

  /**
   * DELETE — Xóa nhân viên
   * Tương đương C#: _context.Employees.Remove(emp); await SaveChangesAsync()
   */
  delete(id: number): Observable<ApiResponse<NhanVien>> {
    return this.http
      .delete<ApiResponse<NhanVien>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError<NhanVien>('Lỗi khi xóa nhân viên')));
  }

  /**
   * Xử lý lỗi mạng (server tắt, timeout, v.v.)
   * Trả về ApiResponse chuẩn với success = false
   */
  private handleError<T>(message: string) {
    return (error: any): Observable<ApiResponse<T>> => {
      console.error('API Error:', error);
      return of({
        success: false,
        data: null,
        message: message,
        errors: [
          error.status === 0
            ? 'Không thể kết nối server. Hãy chắc chắn API đang chạy (dotnet run)'
            : `Lỗi server: ${error.status} ${error.statusText}`
        ]
      });
    };
  }
}
