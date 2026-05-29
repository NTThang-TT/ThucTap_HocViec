using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// 1. CẤU HÌNH CORS: Cho phép Angular (cổng 4200) gọi vào API này
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

// Kích hoạt CORS
app.UseCors("AllowAngular");

// 2. TẠO API ENDPOINT: Khi Frontend gọi link /api/employees, sẽ trả về danh sách này
app.MapGet("/api/employees", () =>
{
    return new List<Employee>
    {
        new Employee(1, "Nguyễn Tất Thắng", "Backend Developer"),
        new Employee(2, "Bảo Hân Nguyễn", "AI Engineer"),
        new Employee(3, "Trần Thị C", "Project Manager")
    };
});

// Ép server chạy cố định ở cổng 5000 cho dễ nhớ
app.Run("http://localhost:5000");

// Record khuôn mẫu dữ liệu
public record Employee(int Id, string Name, string Role);