using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

Console.WriteLine("=== HỆ THỐNG ERP: XỬ LÝ DỮ LIỆU TUẦN 2 ===");

// 1. Chạy hàm bất đồng bộ (Async/Await)
await PhanTichNhanSuAsync();

async Task PhanTichNhanSuAsync()
{
    Console.WriteLine("Đang truy xuất dữ liệu từ máy chủ (Vui lòng chờ 2 giây)...");

    // Giả lập server đang bận rộn lấy dữ liệu
    await Task.Delay(2000);

    // 2. Dùng Collections (List) để chứa danh sách linh hoạt
    List<Employee> employees = new List<Employee>
    {
        new Employee(1, "Nguyễn Tất Thắng", "Backend Developer", 1500),
        new Employee(2, "Bảo Hân Nguyễn", "AI Engineer", 2000),
        new Employee(3, "Trần Văn C", "Intern", 500),
        new Employee(4, "Lê Thị D", "Backend Developer", 1800)
    };

    Console.WriteLine("-> Tải dữ liệu hoàn tất! Đang lọc danh sách...\n");

    // 3. Dùng LINQ để truy vấn siêu tốc
    // Tìm những ai làm Backend VÀ sắp xếp mức lương giảm dần
    var backendDevs = employees
        .Where(emp => emp.Role == "Backend Developer")
        .OrderByDescending(emp => emp.Salary)
        .ToList();

    Console.WriteLine("--- DANH SÁCH TEAM BACKEND (Lương giảm dần) ---");
    foreach (var dev in backendDevs)
    {
        Console.WriteLine($"- Tên: {dev.Name} | Lương: {dev.Salary}$");
    }
}

public record Employee(int Id, string Name, string Role, int Salary);