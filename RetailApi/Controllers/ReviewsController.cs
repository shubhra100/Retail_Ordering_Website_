using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetailApi.Data;
using RetailApi.Models;

namespace RetailApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly RetailDbContext _context;

        public ReviewsController(RetailDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _context.Reviews
                .Include(r => r.Product)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Review>> PostReview(Review review)
        {
            review.CreatedAt = DateTime.UtcNow;
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReviews), new { id = review.ReviewId }, review);
        }

        [HttpPost("respond/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RespondToReview(int id, [FromBody] string response)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();

            review.AdminResponse = response;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
