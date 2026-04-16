using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetailApi.Data;
using RetailApi.Models;

namespace RetailApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly RetailDbContext _context;

        public HomeController(RetailDbContext context)
        {
            _context = context;
        }

        [HttpGet("config")]
        public async Task<ActionResult<HomeConfig>> GetConfig()
        {
            var config = await _context.HomeConfigs.FirstOrDefaultAsync();
            if (config == null) return NotFound();
            return config;
        }

        [HttpPut("config")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateConfig(HomeConfig config)
        {
            var existing = await _context.HomeConfigs.FirstOrDefaultAsync();
            if (existing == null) return NotFound();

            existing.AnnouncementText = config.AnnouncementText;
            existing.HeroTitle = config.HeroTitle;
            existing.HeroSubtitle = config.HeroSubtitle;
            existing.HeroImageUrl = config.HeroImageUrl;
            existing.CtaText = config.CtaText;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("pin-product/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PinProduct(int id, [FromQuery] bool isFeatured, [FromQuery] bool isTrending)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.IsFeatured = isFeatured;
            product.IsTrending = isTrending;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
