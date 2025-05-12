using ApiLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiLibrary.Localization.DTOs
{
    public class LocalizedOwnerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string IdentificationNumber { get; set; } = string.Empty;
        public string? Address { get; set; }

        // Field labels
        public Dictionary<string, string> FieldLabels { get; set; } = new Dictionary<string, string>();

        public static LocalizedOwnerDto FromOwner(Owner owner, string language, LocalizationService localizationService)
        {
            return new LocalizedOwnerDto
            {
                Id = owner.Id,
                Name = owner.Name,
                Telephone = owner.Telephone,
                Email = owner.Email,
                IdentificationNumber = owner.IdentificationNumber,
                Address = owner.Address,
                FieldLabels = new Dictionary<string, string>
                {
                    ["Name"] = localizationService.GetTranslation("Owner.Name", language),
                    ["Telephone"] = localizationService.GetTranslation("Owner.Telephone", language),
                    ["Email"] = localizationService.GetTranslation("Owner.Email", language),
                    ["IdentificationNumber"] = localizationService.GetTranslation("Owner.IdentificationNumber", language),
                    ["Address"] = localizationService.GetTranslation("Owner.Address", language)
                }
            };
        }
    }
}
