using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiLibrary.Models
{
    public class PropertyType
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(255, ErrorMessage = "Description cannot exceed 255 characters")]
        public string Description { get; set; } = string.Empty;

        // Navigation property
        public virtual ICollection<Property>? Properties { get; set; }
    }
}
