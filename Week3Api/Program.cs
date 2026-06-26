using Week3Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// Đăng ký Dependency Injection
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

var app = builder.Build();

// Cấu hình CORS để Angular gọi không bị lỗi
app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.MapControllers();

app.Run();