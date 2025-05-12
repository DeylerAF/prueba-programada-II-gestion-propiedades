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
    public class OwnersControllerTests
    {
        private OwnersController GetControllerWithInMemoryDb(string dbName)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;
            var context = new AppDbContext(options);
            var localizationService = new ApiLibrary.Localization.LocalizationService();
            return new OwnersController(context, localizationService);
        }

        [Fact]
        public async Task GetOwners_ReturnsOkResult()
        {
            var controller = GetControllerWithInMemoryDb("GetOwnersDb");
            controller.ControllerContext.HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            var result = await controller.GetOwners();
            Assert.NotNull(result);
            Assert.IsAssignableFrom<IEnumerable<object>>(result.Value);
        }

        [Fact]
        public async Task CreateOwner_CreatesOwner()
        {
            var controller = GetControllerWithInMemoryDb("PostOwnerDb");
            controller.ControllerContext.HttpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();
            var owner = new Owner
            {
                Name = "Owner Test",
                Telephone = "1234567890",
                Email = "test@email.com",
                IdentificationNumber = "ID123",
                Address = "Test Address"
            };
            var result = await controller.CreateOwner(owner);
            Assert.IsType<CreatedAtActionResult>(result.Result);
        }
    }
}
