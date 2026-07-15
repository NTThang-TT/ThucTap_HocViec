using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleErpApi.Data;
using SimpleErpApi.Models;

namespace SimpleErpApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PositionController : ControllerBase
{
    private readonly AppDbContext _context;

    public PositionController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetPositions()
    {
        var positions = await _context.Positions
            .Select(p => new { p.PositionId, p.PositionName })
            .ToListAsync();
        return Ok(positions);
    }
}
