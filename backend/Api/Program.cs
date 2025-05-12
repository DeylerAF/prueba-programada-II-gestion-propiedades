using ApiLibrary.Data;
using ApiLibrary.Localization;
using Microsoft.EntityFrameworkCore;
using Api.Filters;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(options =>
{
    // Add language filter to detect language for all controller actions
    options.Filters.Add<LanguageFilterAttribute>();
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
});

// Configure DbContext with SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register localization service
builder.Services.AddSingleton<LocalizationService>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Create database if it doesn't exist
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        // Ensure database directory exists
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        if (connectionString != null)
        {
            var dataSource = connectionString.Replace("Data Source=", "").Trim();
            var databaseDirectory = Path.GetDirectoryName(dataSource);
            if (!string.IsNullOrEmpty(databaseDirectory) && !Directory.Exists(databaseDirectory))
            {
                Directory.CreateDirectory(databaseDirectory);
            }
        }

        var context = services.GetRequiredService<AppDbContext>();
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while creating the database.");
    }
}

app.Run();
