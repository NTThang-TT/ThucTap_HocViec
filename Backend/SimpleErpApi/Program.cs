// ==========================================
// ERP SYSTEM — C# API (.NET Minimal API)
// ==========================================

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Cấu hình CORS: cho phép Angular (cổng 4200) gọi API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

// Kích hoạt Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ERP API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAngular");

// ==========================================
// DATABASE GIẢ LẬP (In-Memory)
// ==========================================
var db = new List<NhanVien>
{
    new(1, "NV-2024-001", "Nguyễn Tất Thắng", "IT", "Backend Developer", "thang.nt@erp.vn", "0901234567", new DateTime(2023, 1, 15), "active"),
    new(2, "NV-2024-002", "Bảo Hân Nguyễn", "IT", "AI Engineer", "han.nb@erp.vn", "0912345678", new DateTime(2023, 5, 20), "active"),
    new(3, "NV-2024-003", "Trần Văn C", "Marketing", "Content Creator", "c.tv@erp.vn", "0923456789", new DateTime(2024, 2, 10), "busy"),
    new(4, "NV-2024-004", "Lê Thị D", "HR", "HR Manager", "d.lt@erp.vn", "0934567890", new DateTime(2022, 10, 1), "active"),
    new(5, "NV-2024-005", "Phạm Minh E", "Kế toán", "Accountant", "e.pm@erp.vn", "0945678901", new DateTime(2021, 6, 15), "inactive")
};
int nextId = 6;

// ==========================================
// API ENDPOINTS — CRUD
// ==========================================

// ===== GET: Lấy tất cả nhân viên =====
app.MapGet("/api/nhan-vien", () =>
{
    return Results.Ok(new ApiResponse<List<NhanVien>>(
        Success: true,
        Data: db,
        Message: $"Lấy danh sách thành công ({db.Count} nhân sự)",
        Errors: new List<string>()
    ));
})
.WithTags("Quản lý Nhân Sự")
.Produces<ApiResponse<List<NhanVien>>>(200);

// ===== GET: Lấy 1 nhân viên theo ID =====
app.MapGet("/api/nhan-vien/{id}", (int id) =>
{
    var nv = db.FirstOrDefault(x => x.Id == id);
    if (nv is null)
    {
        return Results.Ok(new ApiResponse<NhanVien?>(
            Success: false,
            Data: null,
            Message: "Không tìm thấy nhân viên",
            Errors: new List<string> { $"Nhân viên với ID={id} không tồn tại" }
        ));
    }

    return Results.Ok(new ApiResponse<NhanVien>(
        Success: true,
        Data: nv,
        Message: "Lấy thông tin thành công",
        Errors: new List<string>()
    ));
})
.WithTags("Quản lý Nhân Sự")
.Produces<ApiResponse<NhanVien>>(200);

// ===== POST: Thêm nhân viên mới (Onboarding) =====
app.MapPost("/api/nhan-vien", (NhanVienDto body) =>
{
    var errors = new List<string>();
    
    // Validate dữ liệu bắt buộc
    if (string.IsNullOrWhiteSpace(body.EmployeeCode)) errors.Add("Mã nhân viên không được để trống");
    if (string.IsNullOrWhiteSpace(body.FullName)) errors.Add("Họ tên không được để trống");
    if (string.IsNullOrWhiteSpace(body.Email)) errors.Add("Email không được để trống");
    else if (!body.Email.Contains("@")) errors.Add("Email không hợp lệ");
    if (string.IsNullOrWhiteSpace(body.Department)) errors.Add("Phòng ban không được để trống");
    if (string.IsNullOrWhiteSpace(body.Role)) errors.Add("Chức vụ không được để trống");

    // Kiểm tra trùng lặp
    if (db.Any(x => x.EmployeeCode.Equals(body.EmployeeCode, StringComparison.OrdinalIgnoreCase)))
        errors.Add($"Mã nhân viên '{body.EmployeeCode}' đã tồn tại trong hệ thống");
    
    if (db.Any(x => x.Email.Equals(body.Email, StringComparison.OrdinalIgnoreCase)))
        errors.Add($"Email '{body.Email}' đã được sử dụng");

    if (errors.Count > 0)
    {
        return Results.Ok(new ApiResponse<NhanVien?>(
            Success: false,
            Data: null,
            Message: "Lỗi xác thực dữ liệu",
            Errors: errors
        ));
    }

    var newNv = new NhanVien(
        nextId++,
        body.EmployeeCode.Trim(),
        body.FullName.Trim(),
        body.Department.Trim(),
        body.Role.Trim(),
        body.Email.Trim(),
        body.Phone?.Trim() ?? "",
        body.JoinDate ?? DateTime.UtcNow,
        body.Trang_thai ?? "active"
    );
    db.Add(newNv);

    return Results.Ok(new ApiResponse<NhanVien>(
        Success: true,
        Data: newNv,
        Message: $"Đã tiếp nhận nhân sự '{newNv.FullName}' thành công",
        Errors: new List<string>()
    ));
})
.WithTags("Quản lý Nhân Sự")
.Produces<ApiResponse<NhanVien>>(200);

// ===== PUT: Cập nhật nhân viên (Promotion & Transfer) =====
app.MapPut("/api/nhan-vien/{id}", (int id, NhanVienDto body) =>
{
    var index = db.FindIndex(x => x.Id == id);
    if (index == -1)
    {
        return Results.Ok(new ApiResponse<NhanVien?>(
            Success: false,
            Data: null,
            Message: "Không tìm thấy nhân viên",
            Errors: new List<string> { $"Nhân viên với ID={id} không tồn tại" }
        ));
    }

    var errors = new List<string>();
    
    // Validate dữ liệu bắt buộc
    if (string.IsNullOrWhiteSpace(body.EmployeeCode)) errors.Add("Mã nhân viên không được để trống");
    if (string.IsNullOrWhiteSpace(body.FullName)) errors.Add("Họ tên không được để trống");
    if (string.IsNullOrWhiteSpace(body.Email)) errors.Add("Email không được để trống");
    else if (!body.Email.Contains("@")) errors.Add("Email không hợp lệ");

    // Kiểm tra trùng lặp (ngoại trừ chính nhân viên đang sửa)
    if (db.Any(x => x.EmployeeCode.Equals(body.EmployeeCode, StringComparison.OrdinalIgnoreCase) && x.Id != id))
        errors.Add($"Mã nhân viên '{body.EmployeeCode}' đã được sử dụng bởi người khác");
        
    if (db.Any(x => x.Email.Equals(body.Email, StringComparison.OrdinalIgnoreCase) && x.Id != id))
        errors.Add($"Email '{body.Email}' đã được sử dụng bởi người khác");

    if (errors.Count > 0)
    {
        return Results.Ok(new ApiResponse<NhanVien?>(
            Success: false,
            Data: null,
            Message: "Lỗi xác thực dữ liệu",
            Errors: errors
        ));
    }

    var updated = new NhanVien(
        id,
        body.EmployeeCode.Trim(),
        body.FullName.Trim(),
        body.Department.Trim(),
        body.Role.Trim(),
        body.Email.Trim(),
        body.Phone?.Trim() ?? "",
        body.JoinDate ?? db[index].JoinDate, // Giữ nguyên ngày cũ nếu không truyền
        body.Trang_thai ?? db[index].Trang_thai
    );
    db[index] = updated;

    return Results.Ok(new ApiResponse<NhanVien>(
        Success: true,
        Data: updated,
        Message: $"Cập nhật hồ sơ '{updated.FullName}' thành công",
        Errors: new List<string>()
    ));
})
.WithTags("Quản lý Nhân Sự")
.Produces<ApiResponse<NhanVien>>(200);

// ===== DELETE: Xóa nhân viên (Soft Delete / Offboarding) =====
app.MapDelete("/api/nhan-vien/{id}", (int id) =>
{
    var index = db.FindIndex(x => x.Id == id);
    if (index == -1)
    {
        return Results.Ok(new ApiResponse<NhanVien?>(
            Success: false,
            Data: null,
            Message: "Không tìm thấy nhân viên",
            Errors: new List<string> { $"Nhân viên với ID={id} không tồn tại" }
        ));
    }

    var nv = db[index];
    
    // SOFT DELETE: Thay vì Remove, chúng ta đổi trạng thái thành inactive
    var offboarded = nv with { Trang_thai = "inactive" };
    db[index] = offboarded;

    return Results.Ok(new ApiResponse<NhanVien>(
        Success: true,
        Data: offboarded,
        Message: $"Đã cho nhân sự '{offboarded.FullName}' nghỉ việc thành công",
        Errors: new List<string>()
    ));
})
.WithTags("Quản lý Nhân Sự")
.Produces<ApiResponse<NhanVien>>(200);

// ==========================================
// CHẠY SERVER
// ==========================================
Console.WriteLine("==================================================");
Console.WriteLine("  🚀 ERP API Server đang chạy!");
Console.WriteLine("  📍 URL:   http://localhost:5000");
Console.WriteLine("  📖 Docs:  http://localhost:5000/swagger");
Console.WriteLine("==================================================");

app.Run("http://localhost:5000");

// ==========================================
// MODELS — Record (kiểu dữ liệu)
// ==========================================

public record NhanVien(
    int Id, 
    string EmployeeCode, 
    string FullName, 
    string Department, 
    string Role, 
    string Email, 
    string Phone,
    DateTime JoinDate,
    string Trang_thai
);

public record NhanVienDto(
    string EmployeeCode, 
    string FullName, 
    string Department, 
    string Role, 
    string Email, 
    string Phone,
    DateTime? JoinDate,
    string? Trang_thai
);

public record ApiResponse<T>(bool Success, T? Data, string Message, List<string> Errors);