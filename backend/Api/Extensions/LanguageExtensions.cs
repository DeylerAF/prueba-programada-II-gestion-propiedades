using ApiLibrary.Localization;
using Microsoft.AspNetCore.Http;

namespace Api.Extensions
{
    public static class LanguageExtensions
    {
        /// <summary>
        /// Gets the language from the HttpContext
        /// </summary>
        public static string GetLanguage(this HttpContext httpContext)
        {
            // First check for language in query string or route
            if (httpContext.Request.Query.TryGetValue("lang", out var queryLang))
            {
                string lang = queryLang.ToString().ToLowerInvariant();
                if (lang == "en" || lang == "es")
                {
                    return lang;
                }
            }

            // Then check HttpContext items (set by LanguageFilterAttribute)
            if (httpContext.Items.TryGetValue("Language", out var language) && language != null)
            {
                return language.ToString()!;
            }

            // Default to English if not found
            return LocalizationExtensions.DefaultLanguage;
        }
    }
}
