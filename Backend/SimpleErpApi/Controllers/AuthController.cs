using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SimpleErpApi.Data;
using SimpleErpApi.DTOs;
using SimpleErpApi.Models;

namespace SimpleErpApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO request)
    {
        var user = await _context.Employees.FirstOrDefaultAsync(u => u.Username == request.Username);
        
        // Demo purpose: If no password hash is set (e.g., existing user), allow login with username as password
        if (user == null || (user.PasswordHash != null && !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)))
        {
            if (user == null || user.PasswordHash != null || request.Password != user.Username)
            {
                return Unauthorized(new { message = "Sai tên đăng nhập hoặc mật khẩu" });
            }
        }

        var tokenString = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // Refresh token valid for 7 days
        await _context.SaveChangesAsync();

        return Ok(new { token = tokenString, refreshToken = refreshToken });
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] TokenApiModel tokenModel)
    {
        if (tokenModel is null || string.IsNullOrEmpty(tokenModel.RefreshToken))
        {
            return BadRequest("Invalid client request");
        }

        var user = await _context.Employees.FirstOrDefaultAsync(u => u.RefreshToken == tokenModel.RefreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token" });
        }

        var newAccessToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        // Optionally extend the refresh token expiration
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();

        return Ok(new { token = newAccessToken, refreshToken = newRefreshToken });
    }

    private string GenerateJwtToken(Employee user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "ThisIsAVerySecretKeyForErpProject2026");

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.Username!),
                new Claim(ClaimTypes.Role, user.Role ?? "Employee"),
                new Claim("EmployeeId", user.EmployeeId)
            }),
            Expires = DateTime.UtcNow.AddHours(2),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}

public class TokenApiModel
{
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
}
