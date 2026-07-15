namespace SimpleErpApi.DTOs;

public class DepartmentStatisticsDTO
{
    public string DepartmentName { get; set; } = string.Empty;
    public int TotalEmployees { get; set; }
    public int ActiveEmployees { get; set; }
    public int OnLeaveEmployees { get; set; }
}

public class EmployeeStatisticsDTO
{
    public int TotalCompanyEmployees { get; set; }
    public List<DepartmentStatisticsDTO> Departments { get; set; } = new();
}
