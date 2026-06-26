using Microsoft.AspNetCore.Mvc;
using Week3Api.Models;
using Week3Api.Services;

namespace Week3Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        // Dependency Injection
        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_employeeService.GetAll());
        }

        [HttpPost]
        public IActionResult Create([FromBody] Employee newEmployee)
        {
            if (string.IsNullOrEmpty(newEmployee.Ten))
            {
                return BadRequest("Tên không được để trống!");
            }
            
            _employeeService.AddEmployee(newEmployee);
            return Ok(new { message = "Thêm thành công!", data = newEmployee });
        }
    }
}