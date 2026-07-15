import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

function pastDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const selectedDate = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate > today) {
    return { futureDate: true };
  }
  return null;
}
import { EmployeeService } from '../services/employee.service';
import { DepartmentService } from '../services/department.service';
import { PositionService } from '../services/position.service';
import { EmployeeDTO, Department, Position } from '../models/employee-dto.model';
import { EmployeeStateService } from '../store/employee.state';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50/50 relative">
      
      <!-- Top Navigation/Header -->
      <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div class="px-6 sm:px-8 max-w-7xl mx-auto h-16 flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <span class="text-xl">📊</span>
              </div>
              <div>
                <h1 class="text-lg font-bold text-slate-800 leading-tight">HR Dashboard</h1>
                <p class="text-xs text-slate-500 font-medium">Quản lý Nhân sự</p>
              </div>
            </div>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center gap-2 border-l border-slate-200 pl-6">
              <a routerLink="/hr-dashboard" class="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg transition-colors">👥 Nhân sự</a>
              <a routerLink="/student-dashboard" class="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors">🎓 Học viên</a>
            </nav>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="hidden lg:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Data: SQL Server
            </div>
            <button
              (click)="onLogout()"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-sm font-medium transition-colors"
            >
              🚪 Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Welcome Section -->
        <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Tổng quan Nhân sự</h2>
            <p class="text-slate-500 mt-1">Theo dõi tình hình biến động nhân sự trực tiếp từ hệ thống.</p>
          </div>
          <div class="flex items-center gap-4">
            @if (isAdminOrHR()) {
              <button (click)="openCreateModal()" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5">
                <span>➕</span> Tiếp nhận nhân sự
              </button>
            }
          </div>
        </div>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <!-- Card 1 -->
          <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-slate-500 mb-1">Tổng nhân viên</p>
                <h3 class="text-3xl font-bold text-slate-800">{{ totalCount() }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">👥</div>
            </div>
            <div class="mt-4 flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 inline-block px-2 py-1 rounded-md">
              <span>↗</span> <span>Cập nhật mới</span>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-slate-500 mb-1">Đang hoạt động</p>
                <h3 class="text-3xl font-bold text-slate-800">{{ activeCount() }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">✅</div>
            </div>
            <div class="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              Tình trạng làm việc bình thường
            </div>
          </div>

          <!-- Card 3 -->
          <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-slate-500 mb-1">Nghỉ phép</p>
                <h3 class="text-3xl font-bold text-slate-800">{{ onLeaveCount() }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">⛱️</div>
            </div>
            <div class="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              Tạm thời vắng mặt
            </div>
          </div>

          <!-- Card 4 -->
          <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-500/10 to-red-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-slate-500 mb-1">Đã nghỉ việc</p>
                <h3 class="text-3xl font-bold text-slate-800">{{ inactiveCount() }}</h3>
              </div>
              <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl">🚫</div>
            </div>
            <div class="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              Đã chấm dứt hợp đồng
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          
          <!-- Table Header / Toolbar -->
          <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Danh sách nhân viên</h3>
              <p class="text-sm text-slate-500 mt-1">Directory dữ liệu trực tiếp từ SQL Server</p>
            </div>
            
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <!-- Department Filter -->
              <div class="relative hidden sm:block">
                <select 
                  (change)="onDepartmentChange($event)"
                  class="bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer appearance-none shadow-sm"
                >
                  <option value="all">Tất cả phòng ban</option>
                  @for (dept of uniqueDepartments(); track dept) {
                    <option [value]="dept">{{ dept }}</option>
                  }
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              <!-- Search -->
              <div class="relative w-full sm:w-64">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input type="text" placeholder="Tìm kiếm nhân viên..." class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm">
              </div>
              
              <button (click)="loadData()" class="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm" title="Tải lại dữ liệu">
                🔄
              </button>
            </div>
          </div>

          <!-- Loading State -->
          @if (isLoading()) {
            <div class="flex flex-col items-center justify-center py-20">
              <div class="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p class="text-slate-500 mt-4 text-sm font-medium animate-pulse">Đang tải dữ liệu từ server...</p>
            </div>
          }

          <!-- Error State -->
          @if (errorMessage()) {
            <div class="p-8">
              <div class="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex flex-col items-center text-center">
                <span class="text-4xl mb-3">⚠️</span>
                <h3 class="text-lg font-bold text-rose-800 mb-1">Không thể lấy dữ liệu</h3>
                <p class="text-rose-600 text-sm mb-4">{{ errorMessage() }}</p>
                <button (click)="loadData()" class="bg-rose-100 hover:bg-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Thử lại
                </button>
              </div>
            </div>
          }

          <!-- Data Table -->
          @if (!isLoading() && !errorMessage()) {
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/80 border-b border-slate-200">
                    <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã NV</th>
                    <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Nhân viên</th>
                    <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                    <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Phòng ban</th>
                    <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Chức vụ</th>
                    <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Trạng thái</th>
                    <th class="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (emp of filteredEmployees(); track emp.employeeId) {
                    <tr class="hover:bg-slate-50/50 transition-colors group">
                      <td class="py-4 px-6">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-mono font-medium border border-slate-200">
                          {{ emp.employeeId }}
                        </span>
                      </td>
                      <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                            {{ emp.fullName.charAt(0) }}
                          </div>
                          <span class="font-semibold text-slate-800">{{ emp.fullName }}</span>
                        </div>
                      </td>
                      <td class="py-4 px-6 text-sm text-slate-600">
                        {{ emp.email }}
                      </td>
                      <td class="py-4 px-6">
                        <span class="text-sm font-medium text-slate-700">{{ emp.departmentName }}</span>
                      </td>
                      <td class="py-4 px-6">
                        <span class="text-sm text-slate-500">{{ emp.positionName }}</span>
                      </td>
                      <td class="py-4 px-6 text-center">
                        @if (emp.status === 'Đang hoạt động') {
                          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium border border-emerald-200">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active
                          </span>
                        } @else if (emp.status === 'Nghỉ phép') {
                          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium border border-amber-200">
                            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            On Leave
                          </span>
                        } @else {
                          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-medium border border-rose-200">
                            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Inactive
                          </span>
                        }
                      </td>
                      <td class="py-4 px-6 text-right">
                        <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          @if (isAdminOrHR()) {
                            <button (click)="openEditModal(emp.employeeId)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip" title="Chỉnh sửa">
                              ✏️
                            </button>
                            <button (click)="deleteEmployee(emp.employeeId)" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors tooltip" title="Cho nghỉ việc">
                              🗑️
                            </button>
                          } @else {
                            <span class="text-xs text-slate-400 italic">Chỉ xem</span>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            @if (employees().length === 0) {
              <div class="flex flex-col items-center justify-center py-16 text-center">
                <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <span class="text-4xl">📭</span>
                </div>
                <h4 class="text-lg font-bold text-slate-800 mb-1">Chưa có dữ liệu nhân viên</h4>
                <p class="text-slate-500 text-sm max-w-sm">Dữ liệu từ bảng Employees đang trống. Hãy kiểm tra lại Backend và Database của bạn.</p>
              </div>
            }
          }
        </div>
        
        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-slate-600 text-xs">
            HRM System — Fullstack .NET 10 + Angular (Role Based UI)
          </p>
        </div>
      </main>
    </div>

    <!-- Modal Form (Create/Edit) -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 class="text-xl font-bold text-slate-800">
              {{ isEditMode() ? 'Chỉnh sửa nhân viên' : 'Tiếp nhận nhân sự mới' }}
            </h3>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
              ✖
            </button>
          </div>

          <!-- Modal Body (Form) -->
          <div class="p-6 overflow-y-auto">
            <form [formGroup]="employeeForm" (ngSubmit)="submitForm()" class="space-y-4">
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Employee ID -->
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Mã NV</label>
                  <input type="text" formControlName="employeeId" readonly
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all opacity-60 cursor-not-allowed"
                    >
                </div>

                <!-- Full Name -->
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Họ và tên <span class="text-rose-500">*</span></label>
                  <input type="text" formControlName="fullName"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="Nhập họ và tên">
                </div>

                <!-- Email -->
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Email (Tự động tạo)</label>
                  <input type="email" formControlName="email"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="Sẽ được tự động tạo nếu để trống">
                </div>

                <!-- Phone -->
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Số điện thoại</label>
                  <input type="text" formControlName="phoneNumber"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="Số điện thoại">
                </div>

                <!-- Department -->
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Phòng ban <span class="text-rose-500">*</span></label>
                  <select formControlName="departmentId"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                    <option value="" disabled>Chọn phòng ban</option>
                    @for (dept of departments(); track dept.departmentId) {
                      <option [value]="dept.departmentId">{{ dept.departmentName }}</option>
                    }
                  </select>
                </div>

                <!-- Position -->
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Chức vụ <span class="text-rose-500">*</span></label>
                  <select formControlName="positionId"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                    <option value="" disabled>Chọn chức vụ</option>
                    @for (pos of positions(); track pos.positionId) {
                      <option [value]="pos.positionId">{{ pos.positionName }}</option>
                    }
                  </select>
                </div>

                <!-- Hire Date -->
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Ngày vào làm <span class="text-rose-500">*</span></label>
                  <input type="date" formControlName="hireDate" [max]="todayDateStr"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                  @if (employeeForm.controls.hireDate.hasError('futureDate') && employeeForm.controls.hireDate.touched) {
                    <p class="text-xs text-rose-500 mt-1">Ngày vào làm không được lớn hơn ngày hiện tại.</p>
                  }
                </div>

                <!-- Status -->
                <div class="space-y-1.5">
                  <label class="text-sm font-medium text-slate-700">Trạng thái <span class="text-rose-500">*</span></label>
                  <select formControlName="status"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Nghỉ phép">Nghỉ phép</option>
                    <option value="Đã nghỉ việc">Đã nghỉ việc</option>
                  </select>
                </div>
              </div>

              <!-- Form Error Message -->
              @if (formError()) {
                <div class="mt-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-lg border border-rose-200">
                  ⚠️ {{ formError() }}
                </div>
              }

              <!-- Modal Footer -->
              <div class="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" (click)="closeModal()" [disabled]="isSaving()"
                  class="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Hủy
                </button>
                <button type="submit" [disabled]="employeeForm.invalid || isSaving()"
                  class="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2">
                  @if (isSaving()) {
                    <span class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Đang lưu...
                  } @else {
                    Lưu thông tin
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HrDashboardComponent implements OnInit {

  // ==========================================
  // DEPENDENCY INJECTION
  // ==========================================
  private employeeState = inject(EmployeeStateService);
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private positionService = inject(PositionService);
  private router = inject(Router);

  // ==========================================
  // STATE MANAGEMENT BẰNG SIGNALS
  // ==========================================
  // Component chỉ việc "đọc" dữ liệu từ Global State
  employees = this.employeeState.employees;
  isLoading = this.employeeState.isLoading;
  errorMessage = this.employeeState.errorMessage;
  totalCount = this.employeeState.totalCount;
  activeCount = this.employeeState.activeCount;
  onLeaveCount = this.employeeState.onLeaveCount;
  inactiveCount = this.employeeState.inactiveCount;
  uniqueDepartments = this.employeeState.uniqueDepartments;

  selectedDepartment = signal<string>('all');

  // Lookup data for Select dropdowns
  departments = signal<Department[]>([]);
  positions = signal<Position[]>([]);

  // Modal State
  isModalOpen = signal(false);
  isEditMode = signal(false);
  isSaving = signal(false);
  formError = signal('');
  todayDateStr = new Date().toISOString().split('T')[0];

  filteredEmployees = computed(() => {
    const empList = this.employees();
    const dept = this.selectedDepartment();
    if (dept === 'all') return empList;
    return empList.filter(e => e.departmentName === dept);
  });

  // ==========================================
  // FORM DEFINITION
  // ==========================================
  employeeForm = new FormGroup({
    employeeId: new FormControl(''),
    fullName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    email: new FormControl('', [Validators.maxLength(100)]),
    phoneNumber: new FormControl('', [Validators.maxLength(15)]),
    departmentId: new FormControl('', [Validators.required]),
    positionId: new FormControl('', [Validators.required]),
    hireDate: new FormControl('', [Validators.required, pastDateValidator]),
    status: new FormControl('Đang hoạt động', [Validators.required])
  });



  // ==========================================
  // ROLE-BASED UI
  // ==========================================
  private authService = inject(AuthService);
  isAdminOrHR = computed(() => {
    return this.authService.hasRole('Admin') || this.authService.hasRole('HR');
  });

  // ==========================================
  // LIFECYCLE
  // ==========================================
  ngOnInit(): void {
    this.loadData();
    this.loadLookups();
  }

  // ==========================================
  // DATA FETCHER
  // ==========================================
  loadData(): void {
    // Kích hoạt action load dữ liệu từ State Store
    this.employeeState.loadEmployees();
  }

  loadLookups(): void {
    this.departmentService.getAll().subscribe({
      next: (data) => this.departments.set(data)
    });
    this.positionService.getAll().subscribe({
      next: (data) => this.positions.set(data)
    });
  }

  // ==========================================
  // CRUD OPERATIONS
  // ==========================================
  openCreateModal(): void {
    this.isEditMode.set(false);
    this.formError.set('');
    this.employeeForm.reset({ status: 'Đang hoạt động' });
    this.isModalOpen.set(true);
  }

  openEditModal(id: string): void {
    this.isEditMode.set(true);
    this.formError.set('');
    this.isModalOpen.set(true);

    // Fetch employee details to fill the form
    this.employeeService.getById(id).subscribe({
      next: (emp) => {
        // Format Date to YYYY-MM-DD for HTML5 date input
        const dateObj = new Date(emp.hireDate);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        this.employeeForm.patchValue({
          employeeId: emp.employeeId,
          fullName: emp.fullName,
          email: emp.email,
          phoneNumber: emp.phoneNumber,
          departmentId: emp.departmentId,
          positionId: emp.positionId,
          hireDate: formattedDate,
          status: emp.status
        });
      },
      error: () => this.formError.set('Không thể tải thông tin nhân viên.')
    });
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.employeeForm.reset();
  }

  submitForm(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.formError.set('');

    // Get raw value to include disabled fields (like employeeId in edit mode)
    const formData = this.employeeForm.getRawValue() as any;

    if (this.isEditMode()) {
      this.employeeService.update(formData.employeeId, formData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.loadData(); // Refresh list
        },
        error: (err) => {
          this.isSaving.set(false);
          let msg = 'Đã xảy ra lỗi khi cập nhật.';
          if (err.error) {
            if (typeof err.error === 'string') msg = err.error;
            else if (err.error.errors) msg = Object.values(err.error.errors).flat().join(' | ');
            else if (err.error.title) msg = err.error.title;
          }
          this.formError.set(msg);
        }
      });
    } else {
      this.employeeService.create(formData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.loadData(); // Refresh list
        },
        error: (err) => {
          this.isSaving.set(false);
          let msg = 'Đã xảy ra lỗi khi thêm mới.';
          if (err.error) {
            if (typeof err.error === 'string') msg = err.error;
            else if (err.error.errors) msg = Object.values(err.error.errors).flat().join(' | ');
            else if (err.error.title) msg = err.error.title;
          }
          this.formError.set(msg);
        }
      });
    }
  }

  deleteEmployee(id: string): void {
    if (confirm(`Bạn có chắc chắn muốn chuyển trạng thái nhân viên ${id} thành "Đã nghỉ việc" không?`)) {
      this.employeeService.delete(id).subscribe({
        next: () => this.loadData(),
        error: () => alert('Lỗi khi xóa nhân viên.')
      });
    }
  }

  // ==========================================
  // AUTH & HELPERS
  // ==========================================
  onLogout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  onDepartmentChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedDepartment.set(select.value);
  }
}
