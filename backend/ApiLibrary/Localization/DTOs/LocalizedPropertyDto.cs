using ApiLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiLibrary.Localization.DTOs
{
    public class LocalizedPropertyDto
    {
        public int Id { get; set; }
        public string Number { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public decimal Area { get; set; }
        public decimal? ConstructionArea { get; set; }
        public int PropertyTypeId { get; set; }
        public int OwnerId { get; set; }

        // Localized navigation properties
        public LocalizedPropertyTypeDto? PropertyType { get; set; }
        public LocalizedOwnerDto? Owner { get; set; }

        // Property field labels
        public Dictionary<string, string> FieldLabels { get; set; } = new Dictionary<string, string>();

        public static async Task<LocalizedPropertyDto> FromPropertyAsync(Property property, string language, LocalizationService localizationService)
        {
            var dto = new LocalizedPropertyDto
            {
                Id = property.Id,
                Number = property.Number,
                Address = property.Address,
                Area = property.Area,
                ConstructionArea = property.ConstructionArea,
                PropertyTypeId = property.PropertyTypeId,
                OwnerId = property.OwnerId,
                FieldLabels = new Dictionary<string, string>
                {
                    ["Number"] = localizationService.GetTranslation("Property.Number", language),
                    ["Address"] = localizationService.GetTranslation("Property.Address", language),
                    ["Area"] = localizationService.GetTranslation("Property.Area", language),
                    ["ConstructionArea"] = localizationService.GetTranslation("Property.ConstructionArea", language),
                    ["PropertyType"] = localizationService.GetTranslation("Property.PropertyType", language),
                    ["Owner"] = localizationService.GetTranslation("Property.Owner", language)
                }
            };

            if (property.PropertyType != null)
            {
                dto.PropertyType = await LocalizedPropertyTypeDto.FromPropertyTypeAsync(property.PropertyType, language, localizationService);
            }

            if (property.Owner != null)
            {
                dto.Owner = LocalizedOwnerDto.FromOwner(property.Owner, language, localizationService);
            }

            return dto;
        }
    }
}
