using Xunit;
using ApiLibrary.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ApiLibrary.Tests.Models
{
    public class OwnerTests
    {
        [Fact]
        public void Required_Fields_Should_Not_Be_Empty()
        {
            var owner = new Owner();
            var context = new ValidationContext(owner);
            var results = new List<ValidationResult>();

            bool isValid = Validator.TryValidateObject(owner, context, results, true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.ErrorMessage.Contains("Name is required"));
            Assert.Contains(results, r => r.ErrorMessage.Contains("Telephone is required"));
            Assert.Contains(results, r => r.ErrorMessage.Contains("Email is required"));
            Assert.Contains(results, r => r.ErrorMessage.Contains("Identification Number is required"));
        }

        [Fact]
        public void Email_Should_Be_Valid_Format()
        {
            var owner = new Owner
            {
                Name = "Test Owner",
                Telephone = "1234567890",
                Email = "invalid-email",
                IdentificationNumber = "ID123"
            };
            var context = new ValidationContext(owner);
            var results = new List<ValidationResult>();

            bool isValid = Validator.TryValidateObject(owner, context, results, true);

            Assert.False(isValid);
            Assert.Contains(results, r => r.ErrorMessage.Contains("Invalid email address format"));
        }
    }
}
