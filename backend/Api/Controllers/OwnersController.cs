using ApiLibrary.Data;
using ApiLibrary.Localization;
using ApiLibrary.Localization.DTOs;
using ApiLibrary.Models;
using Api.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OwnersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly LocalizationService _localizationService;

        public OwnersController(AppDbContext context, LocalizationService localizationService)
        {
            _context = context;
            _localizationService = localizationService;
        }        // GET: api/Owners
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetOwners()
        {
            // Get language from HttpContext using the extension method
            var language = HttpContext.GetLanguage();

            var owners = await _context.Owners.ToListAsync();

            var localizedOwners = owners.Select(o =>
                LocalizedOwnerDto.FromOwner(o, language, _localizationService)
            ).ToList();

            return localizedOwners;
        }

        // GET: api/Owners/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetOwner(int id)
        {
            // Get language from HttpContext using the extension method
            var language = HttpContext.GetLanguage();

            var owner = await _context.Owners.FindAsync(id);

            if (owner == null)
            {
                return NotFound();
            }

            return LocalizedOwnerDto.FromOwner(owner, language, _localizationService);
        }

        // POST: api/Owners
        [HttpPost]
        public async Task<ActionResult<Owner>> CreateOwner(Owner owner)
        {
            _context.Owners.Add(owner);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOwner), new { id = owner.Id }, owner);
        }

        // PUT: api/Owners/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOwner(int id, Owner owner)
        {
            if (id != owner.Id)
            {
                return BadRequest();
            }

            _context.Entry(owner).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OwnerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Owners/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOwner(int id)
        {
            var owner = await _context.Owners.FindAsync(id);
            if (owner == null)
            {
                return NotFound();
            }

            // Check if the owner has associated properties
            var hasProperties = await _context.Properties.AnyAsync(p => p.OwnerId == id);
            if (hasProperties)
            {
                // Get language from HttpContext
                var language = HttpContext.GetLanguage();
                // Use localization service to get the localized error message
                var localizedMessage = _localizationService.GetTranslation("owners.deleteErrorInUse", language);
                return BadRequest(new { message = localizedMessage ?? "Cannot delete owner because they have associated properties." });
            }

            _context.Owners.Remove(owner);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OwnerExists(int id)
        {
            return _context.Owners.Any(e => e.Id == id);
        }
    }
}
