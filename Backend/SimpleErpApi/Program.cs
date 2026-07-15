// ==========================================
// HRM SYSTEM — C# .NET 8 Web API
// Entity Framework Core + SQL Server
// ==========================================

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SimpleErpApi.Data;
using SimpleErpApi.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// ĐĂNG KÝ SERVICES
// ==========================================

// Entity Framework Core — Kết nối SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repository Pattern
builder.Services.AddScoped<SimpleErpApi.Repositories.IEmployeeRepository, SimpleErpApi.Repositories.EmployeeRepository>();

// Controller-based API
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Hãy dán chuỗi Token của bạn vào ô dưới đây (Không cần gõ chữ Bearer)"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? ""))
        };
    });

// CORS: Cho phép Angular (cổng 4200) gọi API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy => policy.WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

// ==========================================
// TỰ ĐỘNG KHỞI TẠO DATABASE TỪ SQL SCRIPT
// ==========================================
// Đọc file HRM_InitDB.sql và thực thi nếu bảng chưa tồn tại

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        // Đảm bảo database tồn tại (tạo nếu chưa có)
        context.Database.EnsureCreated();

        // Kiểm tra bảng Employees đã tồn tại chưa
        var tableExists = false;
        try
        {
            // Thử query bảng Employees — nếu không lỗi thì bảng đã tồn tại
            await context.Database.ExecuteSqlRawAsync(
                "SELECT TOP 1 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Employees'");
            
            // Kiểm tra có dữ liệu chưa
            var count = await context.Employees.CountAsync();
            tableExists = count > 0;
        }
        catch
        {
            tableExists = false;
        }

        if (!tableExists)
        {
            // Đọc file SQL script
            var sqlFilePath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "HRM_InitDB.sql");
            
            // Thử tìm file ở thư mục gốc project trước
            if (!File.Exists(sqlFilePath))
            {
                sqlFilePath = Path.Combine(Directory.GetCurrentDirectory(), "HRM_InitDB.sql");
            }

            if (File.Exists(sqlFilePath))
            {
                logger.LogInformation("📂 Tìm thấy file HRM_InitDB.sql, đang thực thi...");
                
                var sqlScript = await File.ReadAllTextAsync(sqlFilePath);

                // Loại bỏ lệnh CREATE DATABASE và USE (vì EF Core đã kết nối sẵn DB)
                // Tách script theo GO để thực thi từng batch
                var batches = sqlScript
                    .Split(new[] { "\r\nGO\r\n", "\nGO\n", "\r\nGO", "GO\r\n" }, StringSplitOptions.RemoveEmptyEntries)
                    .Where(batch => !string.IsNullOrWhiteSpace(batch))
                    .Where(batch => !batch.Trim().StartsWith("CREATE DATABASE", StringComparison.OrdinalIgnoreCase))
                    .Where(batch => !batch.Trim().StartsWith("USE ", StringComparison.OrdinalIgnoreCase))
                    .ToList();

                foreach (var batch in batches)
                {
                    var cleanBatch = batch.Trim();
                    if (!string.IsNullOrEmpty(cleanBatch))
                    {
                        try
                        {
                            await context.Database.ExecuteSqlRawAsync(cleanBatch);
                            logger.LogInformation("✅ Thực thi batch SQL thành công");
                        }
                        catch (Exception ex)
                        {
                            // Bỏ qua lỗi nếu bảng/dữ liệu đã tồn tại
                            logger.LogWarning("⚠️ Batch SQL bị bỏ qua: {Message}", ex.Message);
                        }
                    }
                }

                logger.LogInformation("🎉 Khởi tạo Database từ HRM_InitDB.sql hoàn tất!");
            }
            else
            {
                logger.LogWarning("⚠️ Không tìm thấy file HRM_InitDB.sql");
            }
        }
        else
        {
            logger.LogInformation("✅ Database đã có dữ liệu, bỏ qua SQL Script.");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "❌ Lỗi khi khởi tạo Database");
    }
}

// ==========================================
// CẤU HÌNH MIDDLEWARE
// ==========================================

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "HRM API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAngular");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ==========================================
// CHẠY SERVER
// ==========================================
Console.WriteLine("==================================================");
Console.WriteLine("  🚀 HRM API Server đang chạy!");
Console.WriteLine("  📍 URL:   http://localhost:5000");
Console.WriteLine("  📖 Docs:  http://localhost:5000/swagger");
Console.WriteLine("  🗄️  DB:   HR_Management_Demo (SQL Server)");
Console.WriteLine("==================================================");

app.Run("http://localhost:5000");