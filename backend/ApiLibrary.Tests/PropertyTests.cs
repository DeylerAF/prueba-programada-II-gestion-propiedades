using Xunit;
using ApiLibrary.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ApiLibrary.Tests.Models
{
    public class PropertyTests
    {
        [Fact]
        public void Area_Should_Be_Required_And_Positive()
        {
            var property = new Property
            {
                Number = "1",
                Address = "Test",
                Area = -1, // Invalid
                PropertyTypeId = 1,
                OwnerId = 1
            };
            var context = new ValidationContext(property);
            var results = new List<ValidationResult>();

            bool isValid = Validator.TryValidateObject(property, context, results, true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.ErrorMessage.Contains("Area must be a positive value"));
        }

        [Fact]
        public void ConstructionArea_Can_Be_Null_Or_Positive()
        {
            var property = new Property
            {
                Number = "1",
                Address = "Test",
                Area = 10,
                ConstructionArea = null, // Valid
                PropertyTypeId = 1,
                OwnerId = 1
            };
            var context = new ValidationContext(property);
            var results = new List<ValidationResult>();

            bool isValid = Validator.TryValidateObject(property, context, results, true);
            Assert.True(isValid);

            property.ConstructionArea = -5; // Invalid
            results.Clear();
            isValid = Validator.TryValidateObject(property, context, results, true);
            Assert.False(isValid);
            Assert.Contains(results, r => r.ErrorMessage.Contains("Construction Area must be a positive value"));
        }
    }
}
