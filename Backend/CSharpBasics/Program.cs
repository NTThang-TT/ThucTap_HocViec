using System;
using System.Collections.Generic;

Console.WriteLine("=== NGÀY 2: THỰC HÀNH C# CƠ BẢN VỚI .NET 10 ===");

// 1. KHOỞI TẠO DANH SÁCH (Collections)
List<Employee> employees = new List<Employee>
{
    new Employee(1, "Nguyen Van A", "Manager"),
    new Employee(2, "Tran Thi B", "Developer"),
    new Employee(3, "Le Van C", "Intern")
};

// 2. VÒNG LẶP & PATTERN MATCHING (Switch Expression)
Console.WriteLine("\n--- Danh sách công việc hôm nay ---");
foreach (var emp in employees)
{
    // Pattern Matching: Cú pháp switch mới, ngắn gọn và trả về giá trị trực tiếp
    string task = emp.Role switch
    {
        "Manager" => "Duyệt báo cáo và phân công công việc.",
        "Developer" => "Viết API quản lý sản phẩm.",
        "Intern" => "Học C# cơ bản và cài đặt môi trường.",
        _ => "Chưa phân công công việc." // Ký tự _ thay thế cho 'default'
    };

    // Chuỗi nội suy (String Interpolation)
    Console.WriteLine($"[{emp.Role}] {emp.Name}: {task}");
}

// 3. RECORD: Đặt khai báo ở cuối file (Quy định của Top-level statements)
public record Employee(int Id, string Name, string Role);