using ApiLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiLibrary.Localization.DTOs
{
    public class LocalizedPropertyTypeDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? LocalizedDescription { get; set; }

        public static async Task<LocalizedPropertyTypeDto> FromPropertyTypeAsync(PropertyType propertyType, string language, LocalizationService localizationService)
        {
            var localized = await localizationService.TranslatePropertyTypeDescriptionAsync(propertyType.Description, language);
            // If the translation returns the key itself, treat as not found
            if (string.IsNullOrEmpty(localized) || localized == $"PropertyType.{propertyType.Description}")
            {
                localized = null;
            }
            return new LocalizedPropertyTypeDto
            {
                Id = propertyType.Id,
                Description = propertyType.Description,
                LocalizedDescription = localized
            };
        }
    }
}
