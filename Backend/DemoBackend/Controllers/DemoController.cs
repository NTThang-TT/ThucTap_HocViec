using Microsoft.AspNetCore.Mvc;
using DemoBackend.Services;

namespace DemoBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DemoController : ControllerBase
    {
        private readonly DemoService _service;

        public DemoController(DemoService service)
        {
            _service = service;
        }

        [HttpGet("top-study")]
        public async Task<IActionResult> GetTopStudy()
        {
            var data = await _service.GetTopStudyActivitiesAsync();
            return Ok(data);
        }
    }
}