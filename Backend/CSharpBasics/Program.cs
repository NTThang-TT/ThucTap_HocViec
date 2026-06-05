using System;
using System.Collections.Generic;
using System.Data.Common;

namespace SimpleERP
{
    class Program
    {
        static void Main(string[] agrs)
        {
            Console.WriteLine("C#");

            List<Employee> employees = new List<Employee>
            {
                new Employee(1,"Nguyen Van A","Manager"),
                new Employee(2,"Tran Van B","Developer"),
                new Employee(3,"Nguyen Thi C","Intern")
            };

            Console.WriteLine("\nDanh sach nv");
            foreach (var emp in employees)
            {
                string task = "";

                switch (emp.Role)
                {
                    case "Manager":
                        task = "Duyet thong bao va phan cong viec.";
                        break;
                    case "Developer":
                        task = "Viet API quan ly san pham.";
                        break;
                    case "Intern":
                        task = "Hoc C# co ban va cai dat moi truong.";
                        break;
                    default:
                        task = "Chua phan cong cong viec.";
                        break;
                }
                Console.WriteLine($"[{emp.Role}] {emp.Name}: {task}");
            }
        }
    }
    public class Employee
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public Employee(int id, string name, string role)
        {
            Id = id;
            Name = name;
            Role = role;
        }
    }
}

// //Console.WriteLine("===.NET 10 ===");
// //List<Employee> employees = new List<Employee>
// {
//     new Employee(1, "Nguyen Van A", "Manager"),
//     new Employee(2, "Tran Thi B", "Developer"),
//     new Employee(3, "Le Van C", "Intern")
// };
// Console.WriteLine("\n--- Danh sách công việc hôm nay ---");
// foreach (var emp in employees)
// {
//     string task = emp.Role switch
//     {
//         "Manager" => "Duyệt báo cáo và phân công công việc.",
//         "Developer" => "Viết API quản lý sản phẩm.",
//         "Intern" => "Học C# cơ bản và cài đặt môi trường.",
//         _ => "Chưa phân công công việc."
//     };
//     // Chuỗi nội suy (String Interpolation)
//     Console.WriteLine($"[{emp.Role}] {emp.Name}: {task}");
// }
// public record Employee(int Id, string Name, string Role);