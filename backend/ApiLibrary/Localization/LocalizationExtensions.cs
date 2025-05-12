using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiLibrary.Localization
{
    public static class LocalizationExtensions
    {
        public const string DefaultLanguage = "en";

        /// <summary>
        /// Get preferred language from HTTP request headers or query parameters
        /// </summary>
        /// <param name="request">The HTTP request</param>
        /// <returns>Language code (en, es, etc.) or default (en)</returns>
        public static string GetLanguageFromRequest(this HttpRequest request)
        {
            // First check if there's a language query parameter
            if (request.Query.TryGetValue("lang", out var langParam))
            {
                string lang = langParam.ToString().ToLowerInvariant();
                if (lang == "en" || lang == "es")
                {
                    return lang;
                }
            }

            // Then check Accept-Language header
            if (request.Headers.TryGetValue("Accept-Language", out var acceptLanguage))
            {
                // Parse Accept-Language header to get preferred language
                var languages = acceptLanguage.ToString().Split(',')
                    .Select(part => part.Split(';')[0].Trim().ToLowerInvariant())
                    .ToList();

                if (languages.Any(l => l.StartsWith("es")))
                {
                    return "es";
                }
                else if (languages.Any(l => l.StartsWith("en")))
                {
                    return "en";
                }
            }

            // Default to English
            return DefaultLanguage;
        }
    }
}
