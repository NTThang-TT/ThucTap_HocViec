using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleErpApi.Models;

/// <summary>
/// Entity Nhân Viên — Map với bảng Employees trong SQL Server
/// Khóa ngoại: DepartmentId → Departments, PositionId → Positions
/// </summary>
[Table("Employees")]
public class Employee
{
    [Key]
    [Column("EmployeeId", TypeName = "VARCHAR(20)")]
    [MaxLength(20)]
    public string EmployeeId { get; set; } = string.Empty;

    [Required]
    [Column("FullName", TypeName = "NVARCHAR(100)")]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Column("Email", TypeName = "VARCHAR(100)")]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Column("PhoneNumber", TypeName = "VARCHAR(15)")]
    [MaxLength(15)]
    public string? PhoneNumber { get; set; }

    // ===== KHÓA NGOẠI =====

    [Required]
    [Column("DepartmentId", TypeName = "VARCHAR(10)")]
    [MaxLength(10)]
    public string DepartmentId { get; set; } = string.Empty;

    [Required]
    [Column("PositionId", TypeName = "VARCHAR(10)")]
    [MaxLength(10)]
    public string PositionId { get; set; } = string.Empty;

    [Required]
    [Column("HireDate", TypeName = "DATE")]
    public DateTime HireDate { get; set; }

    [Column("Status", TypeName = "NVARCHAR(50)")]
    [MaxLength(50)]
    public string Status { get; set; } = "Đang hoạt động";

    // ===== XÁC THỰC (AUTHENTICATION) =====

    [Column("Username", TypeName = "VARCHAR(50)")]
    [MaxLength(50)]
    public string? Username { get; set; }

    [Column("PasswordHash", TypeName = "NVARCHAR(255)")]
    [MaxLength(255)]
    public string? PasswordHash { get; set; }

    [Column("Role", TypeName = "VARCHAR(20)")]
    [MaxLength(20)]
    public string? Role { get; set; } = "Employee";

    [Column("RefreshToken", TypeName = "VARCHAR(255)")]
    [MaxLength(255)]
    public string? RefreshToken { get; set; }

    [Column("RefreshTokenExpiryTime", TypeName = "DATETIME")]
    public DateTime? RefreshTokenExpiryTime { get; set; }

    // ===== NAVIGATION PROPERTIES =====

    [ForeignKey("DepartmentId")]
    public Department? Department { get; set; }

    [ForeignKey("PositionId")]
    public Position? Position { get; set; }
}
