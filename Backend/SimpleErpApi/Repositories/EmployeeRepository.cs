using Microsoft.EntityFrameworkCore;
using SimpleErpApi.Data;
using SimpleErpApi.DTOs;
using SimpleErpApi.Models;

namespace SimpleErpApi.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _context;

    public EmployeeRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EmployeeDTO>> GetAllEmployeesAsync()
    {
        return await _context.Employees
            .Include(e => e.Department)
            .Include(e => e.Position)
            .OrderBy(e => e.EmployeeId)
            .Select(e => new EmployeeDTO
            {
                EmployeeId = e.EmployeeId,
                FullName = e.FullName,
                Email = e.Email,
                DepartmentName = e.Department != null ? e.Department.DepartmentName : "",
                PositionName = e.Position != null ? e.Position.PositionName : "",
                Status = e.Status
            })
            .ToListAsync();
    }

    public async Task<Employee?> GetEmployeeByIdAsync(string id)
    {
        return await _context.Employees.FindAsync(id);
    }

    public async Task<Employee> CreateEmployeeAsync(EmployeeInputDTO dto)
    {
        // Tự động tạo EmployeeId
        var count = await _context.Employees.CountAsync();
        var nextNumber = count + 1;

        var nameParts = dto.FullName.Trim().Split(' ');
        var firstName = nameParts.LastOrDefault();
        var firstLetter = string.IsNullOrEmpty(firstName) ? "X" : firstName.Substring(0, 1).ToUpper();

        string newId = $"NV_{nextNumber}_{firstLetter}";

        while (await _context.Employees.AnyAsync(e => e.EmployeeId == newId))
        {
            nextNumber++;
            newId = $"NV_{nextNumber}_{firstLetter}";
        }

        var normalizedName = RemoveDiacritics(dto.FullName.Trim().ToLower());
        var parts = normalizedName.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        string baseUsername = "user";
        if (parts.Length > 0)
        {
            var lastName = parts.Last();
            var initials = string.Join("", parts.Take(parts.Length - 1).Select(p => p[0]));
            baseUsername = $"{lastName}.{initials}";
        }

        var username = baseUsername;
        int usernameCounter = 1;
        while (await _context.Employees.AnyAsync(e => e.Username == username || e.Email == $"{username}@erp.vn"))
        {
            username = $"{baseUsername}{usernameCounter}";
            usernameCounter++;
        }

        var generatedEmail = $"{username}@erp.vn";

        var employee = new Employee
        {
            EmployeeId = newId,
            FullName = dto.FullName,
            Email = generatedEmail,
            PhoneNumber = dto.PhoneNumber,
            DepartmentId = dto.DepartmentId,
            PositionId = dto.PositionId,
            HireDate = dto.HireDate,
            Status = dto.Status,
            Username = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            Role = "Employee"
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();
        return employee;
    }

    private string RemoveDiacritics(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return text;
        text = text.Replace('đ', 'd').Replace('Đ', 'D');
        var normalizedString = text.Normalize(System.Text.NormalizationForm.FormD);
        var stringBuilder = new System.Text.StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }
        return stringBuilder.ToString().Normalize(System.Text.NormalizationForm.FormC);
    }

    public async Task<bool> UpdateEmployeeAsync(string id, EmployeeInputDTO dto)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null) return false;

        employee.FullName = dto.FullName;
        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            employee.Email = dto.Email;
        }
        employee.PhoneNumber = dto.PhoneNumber;
        employee.DepartmentId = dto.DepartmentId;
        employee.PositionId = dto.PositionId;
        employee.HireDate = dto.HireDate;
        employee.Status = dto.Status;

        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Employees.AnyAsync(e => e.EmployeeId == id)) return false;
            else throw;
        }
    }

    public async Task<bool> DeleteEmployeeAsync(string id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null) return false;

        employee.Status = "Đã nghỉ việc";
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<EmployeeStatisticsDTO> GetEmployeeStatisticsAsync()
    {
        var stats = new EmployeeStatisticsDTO();

        stats.TotalCompanyEmployees = await _context.Employees.CountAsync(e => e.Status != "Đã nghỉ việc");

        stats.Departments = await _context.Employees
            .Include(e => e.Department)
            .GroupBy(e => e.Department != null ? e.Department.DepartmentName : "No Department")
            .Select(g => new DepartmentStatisticsDTO
            {
                DepartmentName = g.Key,
                TotalEmployees = g.Count(),
                ActiveEmployees = g.Count(e => e.Status == "Đang hoạt động"),
                OnLeaveEmployees = g.Count(e => e.Status == "Nghỉ phép")
            })
            .ToListAsync();

        return stats;
    }

    public async Task<bool> EmailExistsAsync(string email, string? excludeId = null)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        var query = _context.Employees.Where(e => e.Email == email);
        if (!string.IsNullOrEmpty(excludeId))
        {
            query = query.Where(e => e.EmployeeId != excludeId);
        }
        return await query.AnyAsync();
    }

    public async Task<bool> PhoneExistsAsync(string phone, string? excludeId = null)
    {
        if (string.IsNullOrWhiteSpace(phone)) return false;
        var query = _context.Employees.Where(e => e.PhoneNumber == phone);
        if (!string.IsNullOrEmpty(excludeId))
        {
            query = query.Where(e => e.EmployeeId != excludeId);
        }
        return await query.AnyAsync();
    }
}
