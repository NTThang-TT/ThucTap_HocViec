// ==========================================
// ERP SYSTEM — C# API (.NET Minimal API)
// ==========================================
// Chạy: cd d:\Thuctap\ThucTap_HocViec\Backend\SimpleErpApi
//        dotnet run
// API:   http://localhost:5000
// Docs:  http://localhost:5000/swagger (nếu có OpenApi)
// ==========================================

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

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
    new(1, "Nguyễn Tất Thắng", "Backend Developer",  "thang.nt@erp.vn", "active"),
    new(2, "Bảo Hân Nguyễn",   "AI Engineer",        "han.nb@erp.vn",   "active"),
    new(3, "Trần Văn C",        "Intern",             "c.tv@erp.vn",     "busy"),
    new(4, "Lê Thị D",          "Frontend Developer", "d.lt@erp.vn",     "active"),
    new(5, "Phạm Minh E",       "Backend Developer",  "e.pm@erp.vn",     "offline"),
    new(6, "Hoàng Văn F",       "DevOps Engineer",    "f.hv@erp.vn",     "active"),
};
int nextId = 7;

// ==========================================
// API ENDPOINTS — CRUD
// ==========================================

// ===== GET: Lấy tất cả nhân viên =====
app.MapGet("/api/nhan-vien", () =>
{
    return Results.Ok(new ApiResponse<List<NhanVien>>(
        Success: true,
        Data: db,
        Message: $"Lấy danh sách thành công ({db.Count} nhân viên)",
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

// ===== POST: Thêm nhân viên mới =====
app.MapPost("/api/nhan-vien", (NhanVienDto body) =>
{
    // Validate dữ liệu
    var errors = new List<string>();
    if (string.IsNullOrWhiteSpace(body.Ten))
        errors.Add("Tên không được để trống");
    if (string.IsNullOrWhiteSpace(body.Email))
        errors.Add("Email không được để trống");
    else if (!body.Email.Contains("@"))
        errors.Add("Email không hợp lệ (thiếu @)");

    // Kiểm tra email trùng
    if (db.Any(x => x.Email == body.Email))
        errors.Add($"Email '{body.Email}' đã tồn tại");

    if (errors.Count > 0)
    {
        return Results.Ok(new ApiResponse<NhanVien?>(
            Success: false,
            Data: null,
            Message: "Lỗi xác thực dữ liệu",
            Errors: errors
        ));
    }

    // Tạo nhân viên mới
    var newNv = new NhanVien(
        nextId++,
        body.Ten.Trim(),
        body.Role.Trim(),
        body.Email.Trim(),
        body.Trang_thai ?? "active"
    );
    db.Add(newNv);

    return Results.Ok(new ApiResponse<NhanVien>(
        Success: true,
        Data: newNv,
        Message: $"Thêm nhân viên '{newNv.Ten}' thành công",
        Errors: new List<string>()
    ));
})
.WithTags("Quản lý Nhân Sự")
.Produces<ApiResponse<NhanVien>>(200);

// ===== PUT: Cập nhật nhân viên =====
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

    // Validate
    var errors = new List<string>();
    if (string.IsNullOrWhiteSpace(body.Ten))
        errors.Add("Tên không được để trống");
    if (!string.IsNullOrEmpty(body.Email) && !body.Email.Contains("@"))
        errors.Add("Email không hợp lệ");

    // Kiểm tra email trùng (trừ chính mình)
    if (db.Any(x => x.Email == body.Email && x.Id != id))
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

    // Cập nhật (record là immutable → tạo mới)
    var updated = new NhanVien(
        id,
        body.Ten.Trim(),
        body.Role.Trim(),
        body.Email.Trim(),
        body.Trang_thai ?? "active"
    );
    db[index] = updated;

    return Results.Ok(new ApiResponse<NhanVien>(
        Success: true,
        Data: updated,
        Message: $"Cập nhật nhân viên '{updated.Ten}' thành công",
        Errors: new List<string>()
    ));
})
.WithTags("Quản lý Nhân Sự")
.Produces<ApiResponse<NhanVien>>(200);

// ===== DELETE: Xóa nhân viên =====
app.MapDelete("/api/nhan-vien/{id}", (int id) =>
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

    db.Remove(nv);

    return Results.Ok(new ApiResponse<NhanVien>(
        Success: true,
        Data: nv,
        Message: $"Xóa nhân viên '{nv.Ten}' thành công",
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

/// <summary>
/// Nhân viên — dữ liệu đầy đủ (trả về từ API)
/// </summary>
public record NhanVien(int Id, string Ten, string Role, string Email, string Trang_thai);

/// <summary>
/// DTO — dữ liệu gửi lên khi tạo/sửa (không có Id)
/// </summary>
public record NhanVienDto(string Ten, string Role, string Email, string? Trang_thai);

/// <summary>
/// API Response chuẩn — Generic
/// Thành công: { Success: true,  Data: [...], Message: "OK", Errors: [] }
/// Lỗi:       { Success: false, Data: null,  Message: "Lỗi", Errors: ["..."] }
/// </summary>
public record ApiResponse<T>(bool Success, T? Data, string Message, List<string> Errors);