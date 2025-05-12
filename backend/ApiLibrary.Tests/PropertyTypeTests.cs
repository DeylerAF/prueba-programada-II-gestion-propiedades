using Xunit;
using ApiLibrary.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ApiLibrary.Tests.Models
{
    public class PropertyTypeTests
    {
        [Fact]
        public void Description_Is_Required_And_MaxLength()
        {
            var propertyType = new PropertyType { Description = "" };
            var context = new ValidationContext(propertyType);
            var results = new List<ValidationResult>();

            bool isValid = Validator.TryValidateObject(propertyType, context, results, true);
            Assert.False(isValid);
            Assert.Contains(results, r => r.ErrorMessage.Contains("Description is required"));

            propertyType.Description = new string('a', 300); // Exceeds max length
            results.Clear();
            isValid = Validator.TryValidateObject(propertyType, context, results, true);
            Assert.False(isValid);
            Assert.Contains(results, r => r.ErrorMessage.Contains("Description cannot exceed 255 characters"));
        }
    }
}
