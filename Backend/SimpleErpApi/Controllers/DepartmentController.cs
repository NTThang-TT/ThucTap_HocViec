using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleErpApi.Data;
using SimpleErpApi.Models;

namespace SimpleErpApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentController : ControllerBase
{
    private readonly AppDbContext _context;

    public DepartmentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetDepartments()
    {
        var departments = await _context.Departments
            .Select(d => new { d.DepartmentId, d.DepartmentName })
            .ToListAsync();
        return Ok(departments);
    }
}
