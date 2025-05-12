using Xunit;
using Api.Controllers;
using ApiLibrary.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Moq;
using ApiLibrary.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace ApiLibrary.Tests.Controllers
{
    public class PropertyTypesControllerTests
    {
        private PropertyTypesController GetControllerWithInMemoryDb(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;
            var context = new AppDbContext(options);
            var localizationService = new ApiLibrary.Localization.LocalizationService();
            return new PropertyTypesController(context, localizationService);
        }

        [Fact]
        public async Task GetPropertyTypes_ReturnsOkResult()
        {
            var controller = GetControllerWithInMemoryDb("GetPropertyTypesDb");
            controller.ControllerContext.HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            var result = await controller.GetPropertyTypes();
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<object>>(result.Value);
        }

        [Fact]
        public async Task CreatePropertyType_CreatesPropertyType()
        {
            var controller = GetControllerWithInMemoryDb("PostPropertyTypeDb");
            controller.ControllerContext.HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            var propertyType = new PropertyType
            {
                Description = "Type Test"
            };
            var result = await controller.CreatePropertyType(propertyType);
            Assert.IsType<CreatedAtActionResult>(result.Result);
        }
    }
}
