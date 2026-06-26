using Week3Api.Models;

namespace Week3Api.Services
{
    public interface IEmployeeService
    {
        List<Employee> GetAll();
        void AddEmployee(Employee employee);
    }
}