using SimpleErpApi.DTOs;
using SimpleErpApi.Models;

namespace SimpleErpApi.Repositories;

public interface IEmployeeRepository
{
    Task<List<EmployeeDTO>> GetAllEmployeesAsync();
    Task<Employee?> GetEmployeeByIdAsync(string id);
    Task<Employee> CreateEmployeeAsync(EmployeeInputDTO dto);
    Task<bool> UpdateEmployeeAsync(string id, EmployeeInputDTO dto);
    Task<bool> DeleteEmployeeAsync(string id);
    Task<EmployeeStatisticsDTO> GetEmployeeStatisticsAsync();
    Task<bool> EmailExistsAsync(string email, string? excludeId = null);
    Task<bool> PhoneExistsAsync(string phone, string? excludeId = null);
}
