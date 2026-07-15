using System.ComponentModel.DataAnnotations;

namespace SimpleErpApi.DTOs;

public class EmployeeInputDTO
{
    [MaxLength(20)]
    public string? EmployeeId { get; set; }

    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [EmailAddress(ErrorMessage = "Định dạng email không hợp lệ")]
    [MaxLength(100)]
    public string? Email { get; set; }

    [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
    [MaxLength(15)]
    public string? PhoneNumber { get; set; }

    [Required]
    [MaxLength(10)]
    public string DepartmentId { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    public string PositionId { get; set; } = string.Empty;

    [Required]
    public DateTime HireDate { get; set; }

    [Required]
    [MaxLength(50)]
    public string Status { get; set; } = "Đang hoạt động";
}
