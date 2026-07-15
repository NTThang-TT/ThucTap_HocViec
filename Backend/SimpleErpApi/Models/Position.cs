using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SimpleErpApi.Models;

/// <summary>
/// Entity Chức Vụ — Map với bảng Positions trong SQL Server
/// </summary>
[Table("Positions")]
public class Position
{
    [Key]
    [Column("PositionId", TypeName = "VARCHAR(10)")]
    [MaxLength(10)]
    public string PositionId { get; set; } = string.Empty;

    [Required]
    [Column("PositionName", TypeName = "NVARCHAR(100)")]
    [MaxLength(100)]
    public string PositionName { get; set; } = string.Empty;

    [Required]
    [Column("BaseSalary", TypeName = "DECIMAL(18, 2)")]
    public decimal BaseSalary { get; set; }

    // Navigation Property: 1 Chức vụ có nhiều Nhân viên
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
