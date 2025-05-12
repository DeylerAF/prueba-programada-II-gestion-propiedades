using ApiLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiLibrary.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<PropertyType> PropertyTypes { get; set; }
        public DbSet<Owner> Owners { get; set; }
        public DbSet<Property> Properties { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Property>()
                .HasOne(p => p.PropertyType)
                .WithMany(pt => pt.Properties)
                .HasForeignKey(p => p.PropertyTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Property>()
                .HasOne(p => p.Owner)
                .WithMany(o => o.Properties)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);            // Seed data
            SeedData(modelBuilder);
        }
        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed PropertyTypes
            modelBuilder.Entity<PropertyType>().HasData(
                new PropertyType { Id = 1, Description = "House" },
                new PropertyType { Id = 2, Description = "Apartment" },
                new PropertyType { Id = 3, Description = "Commercial" },
                new PropertyType { Id = 4, Description = "Land" },
                new PropertyType { Id = 5, Description = "Industrial" }
            );

            // Seed Owners
            modelBuilder.Entity<Owner>().HasData(
                new Owner
                {
                    Id = 1,
                    Name = "John Doe",
                    Telephone = "+1-555-123-4567",
                    Email = "john.doe@example.com",
                    IdentificationNumber = "123-45-6789",
                    Address = "123 Owner St, City"
                },
                new Owner
                {
                    Id = 2,
                    Name = "Jane Smith",
                    Telephone = "+1-555-765-4321",
                    Email = "jane.smith@example.com",
                    IdentificationNumber = "987-65-4321",
                    Address = "456 Owner Ave, City"
                },
                new Owner
                {
                    Id = 3,
                    Name = "Robert Johnson",
                    Telephone = "+1-555-987-6543",
                    Email = "robert.johnson@example.com",
                    IdentificationNumber = "456-78-9012",
                    Address = "789 Owner Blvd, City"
                }
            );

            // Seed Properties
            modelBuilder.Entity<Property>().HasData(
                new Property
                {
                    Id = 1,
                    Number = "A101",
                    Address = "123 Main St, Downtown",
                    Area = 80.5M,
                    ConstructionArea = 75.0M,
                    PropertyTypeId = 2,
                    OwnerId = 1
                },
                new Property
                {
                    Id = 2,
                    Number = "H202",
                    Address = "456 Oak Ave, Suburbia",
                    Area = 250.0M,
                    ConstructionArea = 180.0M,
                    PropertyTypeId = 1,
                    OwnerId = 2
                },
                new Property
                {
                    Id = 3,
                    Number = "C303",
                    Address = "789 Business Blvd, Financial District",
                    Area = 350.0M,
                    ConstructionArea = 330.0M,
                    PropertyTypeId = 3,
                    OwnerId = 3
                },
                new Property
                {
                    Id = 4,
                    Number = "L404",
                    Address = "101 Rural Route, Countryside",
                    Area = 5000.0M,
                    ConstructionArea = 4300.0M,
                    PropertyTypeId = 4,
                    OwnerId = 1
                },
                new Property
                {
                    Id = 5,
                    Number = "I505",
                    Address = "202 Industry Way, Industrial Park",
                    Area = 1200.0M,
                    ConstructionArea = 1100.0M,
                    PropertyTypeId = 5,
                    OwnerId = 2
                }
            );
        }
    }
}
