using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleErpApi.Models;

/// <summary>
/// Entity Phòng Ban — Map với bảng Departments trong SQL Server
/// </summary>
[Table("Departments")]
public class Department
{
    [Key]
    [Column("DepartmentId", TypeName = "VARCHAR(10)")]
    [MaxLength(10)]
    public string DepartmentId { get; set; } = string.Empty;

    [Required]
    [Column("DepartmentName", TypeName = "NVARCHAR(100)")]
    [MaxLength(100)]
    public string DepartmentName { get; set; } = string.Empty;

    [Column("Location", TypeName = "NVARCHAR(100)")]
    [MaxLength(100)]
    public string? Location { get; set; }

    // Navigation Property: 1 Phòng ban có nhiều Nhân viên
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
