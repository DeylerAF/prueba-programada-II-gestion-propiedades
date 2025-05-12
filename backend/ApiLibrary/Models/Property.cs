using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiLibrary.Models
{
    public class Property
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Number is required")]
        [StringLength(255, ErrorMessage = "Number cannot exceed 255 characters")]
        public string Number { get; set; } = string.Empty;

        [Required(ErrorMessage = "Address is required")]
        [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "Area is required")]
        [Range(0, double.MaxValue, ErrorMessage = "Area must be a positive value")]
        public decimal Area { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Construction Area must be a positive value")]
        public decimal? ConstructionArea { get; set; }

        [Required(ErrorMessage = "Property type is required")]
        public int PropertyTypeId { get; set; }

        [Required(ErrorMessage = "Owner is required")]
        public int OwnerId { get; set; }

        // Navigation properties
        [ForeignKey("PropertyTypeId")]
        public virtual PropertyType? PropertyType { get; set; }

        [ForeignKey("OwnerId")]
        public virtual Owner? Owner { get; set; }
    }
}
