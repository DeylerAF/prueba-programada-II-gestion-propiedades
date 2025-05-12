using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiLibrary.Localization
{
    public class LocalizationService
    {
        private readonly Dictionary<string, Dictionary<string, string>> _translations;
        private readonly string _defaultLanguage = "en";

        private readonly GoogleTranslateService _googleTranslateService = new GoogleTranslateService();

        public LocalizationService()
        {
            _translations = new Dictionary<string, Dictionary<string, string>>
            {
                // English translations (default)
                ["en"] = new Dictionary<string, string>
                {
                    // Property Types
                    ["PropertyType.House"] = "House",
                    ["PropertyType.Apartment"] = "Apartment",
                    ["PropertyType.Commercial"] = "Commercial",
                    ["PropertyType.Land"] = "Land",
                    ["PropertyType.Industrial"] = "Industrial",

                    // Sample Owner data keys (for display purposes)
                    ["Owner.Name"] = "Name",
                    ["Owner.Telephone"] = "Telephone",
                    ["Owner.Email"] = "Email",
                    ["Owner.IdentificationNumber"] = "Identification Number",
                    ["Owner.Address"] = "Address",

                    // Sample Property data keys
                    ["Property.Number"] = "Number",
                    ["Property.Address"] = "Address",
                    ["Property.Area"] = "Area",
                    ["Property.ConstructionArea"] = "Construction Area",
                    ["Property.PropertyType"] = "Property Type",
                    ["Property.Owner"] = "Owner",

                    // Custom error messages
                    ["owners.deleteErrorInUse"] = "Cannot delete owner because they have associated properties.",
                    ["propertyTypes.deleteErrorInUse"] = "Cannot delete property type because it has associated properties."
                },

                // Spanish translations
                ["es"] = new Dictionary<string, string>
                {
                    // Property Types
                    ["PropertyType.House"] = "Casa",
                    ["PropertyType.Apartment"] = "Apartamento",
                    ["PropertyType.Commercial"] = "Comercial",
                    ["PropertyType.Land"] = "Terreno",
                    ["PropertyType.Industrial"] = "Industrial",

                    // Sample Owner data keys (for display purposes)
                    ["Owner.Name"] = "Nombre",
                    ["Owner.Telephone"] = "Teléfono",
                    ["Owner.Email"] = "Correo Electrónico",
                    ["Owner.IdentificationNumber"] = "Número de Identificación",
                    ["Owner.Address"] = "Dirección",

                    // Sample Property data keys
                    ["Property.Number"] = "Número",
                    ["Property.Address"] = "Dirección",
                    ["Property.Area"] = "Área",
                    ["Property.ConstructionArea"] = "Área de Construcción",
                    ["Property.PropertyType"] = "Tipo de Propiedad",
                    ["Property.Owner"] = "Propietario",

                    // Custom error messages
                    ["owners.deleteErrorInUse"] = "No se puede eliminar el propietario porque tiene propiedades asociadas.",
                    ["propertyTypes.deleteErrorInUse"] = "No se puede eliminar el tipo de propiedad porque tiene propiedades asociadas."
                }
            };
        }

        public string GetTranslation(string key, string language)
        {
            // If language not supported or translation not found, fallback to default language
            if (!_translations.ContainsKey(language) || !_translations[language].ContainsKey(key))
            {
                return _translations[_defaultLanguage].ContainsKey(key)
                    ? _translations[_defaultLanguage][key]
                    : key;
            }

            return _translations[language][key];
        }

        public Dictionary<string, string> GetAllTranslations(string language)
        {
            if (!_translations.ContainsKey(language))
            {
                return _translations[_defaultLanguage];
            }

            return _translations[language];
        }

        public async Task<string> TranslatePropertyTypeDescriptionAsync(string description, string language)
        {
            string key = $"PropertyType.{description}";
            var translation = GetTranslation(key, language);
            // If translation is missing or returns the key itself, use Google Translate
            if (string.IsNullOrEmpty(translation) || translation == key)
            {
                // Google Translate expects language codes like 'es', 'en', etc.
                translation = await _googleTranslateService.TranslateAsync(description, language);
            }
            return translation;
        }
    }
}
