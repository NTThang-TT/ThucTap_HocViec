namespace SimpleErpApi.DTOs;

/// <summary>
/// EmployeeDTO — Dữ liệu trả về cho Frontend
/// Bao gồm tên Phòng ban và tên Chức vụ (đã JOIN)
/// </summary>
public class EmployeeDTO
{
    public string EmployeeId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public string PositionName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
