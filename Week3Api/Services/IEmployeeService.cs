using Week3Api.Models;

namespace Week3Api.Services
{
    public class EmployeeService : IEmployeeService
    {
        private static List<Employee> _employees = new List<Employee>();

        public List<Employee> GetAll()
        {
            return _employees;
        }

        public void AddEmployee(Employee employee)
        {
            employee.Id = _employees.Count > 0 ? _employees.Max(e => e.Id) + 1 : 1;
            _employees.Add(employee);
        }
    }
}