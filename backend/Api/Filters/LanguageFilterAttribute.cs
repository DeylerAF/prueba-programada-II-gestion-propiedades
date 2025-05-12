using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace Api.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class LanguageFilterAttribute : Attribute, IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Skip if language is already part of the route or query
            if (context.RouteData.Values.ContainsKey("lang") ||
                context.HttpContext.Request.Query.ContainsKey("lang"))
            {
                return;
            }

            // Set default language based on Accept-Language header
            string language = "en"; // Default

            if (context.HttpContext.Request.Headers.TryGetValue("Accept-Language", out var acceptLanguage))
            {
                var languages = acceptLanguage.ToString().Split(',')
                    .Select(part => part.Split(';')[0].Trim().ToLowerInvariant())
                    .ToList();

                if (languages.Any(l => l.StartsWith("es")))
                {
                    language = "es";
                }
                else if (languages.Any(l => l.StartsWith("en")))
                {
                    language = "en";
                }
            }

            // Add language to HttpContext items for later access
            context.HttpContext.Items["Language"] = language;
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Nothing to do after action execution
        }
    }
}
