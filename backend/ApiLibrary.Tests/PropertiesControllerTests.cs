using Xunit;
using Api.Controllers;
using System.IO;
using ApiLibrary.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using ApiLibrary.Data;
using Microsoft.EntityFrameworkCore;

namespace ApiLibrary.Tests.Controllers
{
    public class PropertiesControllerTests
    {
        private PropertiesController GetControllerWithInMemoryDb(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;
            var context = new AppDbContext(options);
            var localizationService = new ApiLibrary.Localization.LocalizationService();
            return new PropertiesController(context, localizationService);
        }

        [Fact]
        public async Task GetProperties_ReturnsOkResult()
        {
            var controller = GetControllerWithInMemoryDb("GetPropertiesDb");
            controller.ControllerContext.HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            var result = await controller.GetProperties();
            Assert.NotNull(result);
            // The result is a list of LocalizedPropertyDto, not an ActionResult
            Assert.IsAssignableFrom<IEnumerable<object>>(result.Value);
        }

        [Fact]
        public async Task CreateProperty_CreatesProperty()
        {
            var controller = GetControllerWithInMemoryDb("PostPropertyDb");
            controller.ControllerContext.HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            // Add required related entities
            var contextField = typeof(PropertiesController).GetField("_context", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
            var context = (AppDbContext)contextField.GetValue(controller);
            context.PropertyTypes.Add(new PropertyType { Id = 1, Description = "Type" });
            context.Owners.Add(new Owner { Id = 1, Name = "Owner", Telephone = "123", Email = "a@a.com", IdentificationNumber = "ID" });
            context.SaveChanges();
            var property = new Property
            {
                Number = "Test1",
                Address = "Test Address",
                Area = 100,
                PropertyTypeId = 1,
                OwnerId = 1
            };
            var result = await controller.CreateProperty(property);
            Assert.IsType<CreatedAtActionResult>(result.Result);
        }
    }
}
