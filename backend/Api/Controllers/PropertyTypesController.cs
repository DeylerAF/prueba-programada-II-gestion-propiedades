using ApiLibrary.Data;
using ApiLibrary.Localization;
using ApiLibrary.Localization.DTOs;
using ApiLibrary.Models;
using Api.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyTypesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly LocalizationService _localizationService;

        public PropertyTypesController(AppDbContext context, LocalizationService localizationService)
        {
            _context = context;
            _localizationService = localizationService;
        }        // GET: api/PropertyTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetPropertyTypes()
        {
            // Get language from HttpContext using the extension method
            var language = HttpContext.GetLanguage();

            var propertyTypes = await _context.PropertyTypes.ToListAsync();

            var localizedPropertyTypes = new List<LocalizedPropertyTypeDto>();
            foreach (var pt in propertyTypes)
            {
                var dto = await LocalizedPropertyTypeDto.FromPropertyTypeAsync(pt, language, _localizationService);
                localizedPropertyTypes.Add(dto);
            }

            return localizedPropertyTypes;
        }

        // GET: api/PropertyTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetPropertyType(int id)
        {
            // Get language from HttpContext using the extension method
            var language = HttpContext.GetLanguage();

            var propertyType = await _context.PropertyTypes.FindAsync(id);

            if (propertyType == null)
            {
                return NotFound();
            }

            return await LocalizedPropertyTypeDto.FromPropertyTypeAsync(propertyType, language, _localizationService);
        }

        // POST: api/PropertyTypes
        [HttpPost]
        public async Task<ActionResult<PropertyType>> CreatePropertyType(PropertyType propertyType)
        {
            _context.PropertyTypes.Add(propertyType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPropertyType), new { id = propertyType.Id }, propertyType);
        }

        // PUT: api/PropertyTypes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePropertyType(int id, PropertyType propertyType)
        {
            if (id != propertyType.Id)
            {
                return BadRequest();
            }

            _context.Entry(propertyType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PropertyTypeExists(id))
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

        // DELETE: api/PropertyTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePropertyType(int id)
        {
            var propertyType = await _context.PropertyTypes.FindAsync(id);
            if (propertyType == null)
            {
                return NotFound();
            }

            // Check if the property type has associated properties
            var hasProperties = await _context.Properties.AnyAsync(p => p.PropertyTypeId == id);
            if (hasProperties)
            {
                // Get language from HttpContext
                var language = HttpContext.GetLanguage();
                // Use localization service to get the localized error message
                var localizedMessage = _localizationService.GetTranslation("propertyTypes.deleteErrorInUse", language);
                return BadRequest(new { message = localizedMessage ?? "Cannot delete property type because it has associated properties." });
            }

            _context.PropertyTypes.Remove(propertyType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PropertyTypeExists(int id)
        {
            return _context.PropertyTypes.Any(e => e.Id == id);
        }
    }
}
