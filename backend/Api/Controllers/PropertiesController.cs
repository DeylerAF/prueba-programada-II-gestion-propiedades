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
    public class PropertiesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly LocalizationService _localizationService;

        public PropertiesController(AppDbContext context, LocalizationService localizationService)
        {
            _context = context;
            _localizationService = localizationService;
        }

        // GET: api/Properties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProperties()
        {
            // Get language from HttpContext using the extension method
            var language = HttpContext.GetLanguage();

            var properties = await _context.Properties
                .Include(p => p.PropertyType)
                .Include(p => p.Owner)
                .ToListAsync();

            // Use LocalizedPropertyDto to ensure proper translation of property types and field labels
            var localizedProperties = new List<LocalizedPropertyDto>();
            foreach (var p in properties)
            {
                var dto = await LocalizedPropertyDto.FromPropertyAsync(p, language, _localizationService);
                localizedProperties.Add(dto);
            }

            return localizedProperties;
        }

        // GET: api/Properties/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetProperty(int id)
        {
            // Get language from HttpContext using the extension method
            var language = HttpContext.GetLanguage();

            var property = await _context.Properties
                .Include(p => p.PropertyType)
                .Include(p => p.Owner)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
            {
                return NotFound();
            }

            return await LocalizedPropertyDto.FromPropertyAsync(property, language, _localizationService);
        }

        // POST: api/Properties
        [HttpPost]
        public async Task<ActionResult<Property>> CreateProperty(Property property)
        {
            // Validate that the property type exists
            var propertyTypeExists = await _context.PropertyTypes.AnyAsync(pt => pt.Id == property.PropertyTypeId);
            if (!propertyTypeExists)
            {
                return BadRequest("Property type does not exist.");
            }

            // Validate that the owner exists
            var ownerExists = await _context.Owners.AnyAsync(o => o.Id == property.OwnerId);
            if (!ownerExists)
            {
                return BadRequest("Owner does not exist.");
            }

            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
        }

        // PUT: api/Properties/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProperty(int id, Property property)
        {
            if (id != property.Id)
            {
                return BadRequest();
            }

            // Validate that the property type exists
            var propertyTypeExists = await _context.PropertyTypes.AnyAsync(pt => pt.Id == property.PropertyTypeId);
            if (!propertyTypeExists)
            {
                return BadRequest("Property type does not exist.");
            }

            // Validate that the owner exists
            var ownerExists = await _context.Owners.AnyAsync(o => o.Id == property.OwnerId);
            if (!ownerExists)
            {
                return BadRequest("Owner does not exist.");
            }

            _context.Entry(property).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PropertyExists(id))
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

        // DELETE: api/Properties/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            var property = await _context.Properties.FindAsync(id);
            if (property == null)
            {
                return NotFound();
            }

            _context.Properties.Remove(property);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PropertyExists(int id)
        {
            return _context.Properties.Any(e => e.Id == id);
        }
    }
}
