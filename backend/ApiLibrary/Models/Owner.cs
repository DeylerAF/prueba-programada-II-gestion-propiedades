using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiLibrary.Models
{
    public class Owner
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(255, ErrorMessage = "Name cannot exceed 255 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Telephone is required")]
        [StringLength(255, ErrorMessage = "Telephone cannot exceed 255 characters")]
        public string Telephone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address format")]
        [StringLength(255, ErrorMessage = "Email cannot exceed 255 characters")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Identification Number is required")]
        [StringLength(255, ErrorMessage = "Identification Number cannot exceed 255 characters")]
        public string IdentificationNumber { get; set; } = string.Empty;

        [StringLength(255, ErrorMessage = "Address cannot exceed 255 characters")]
        public string? Address { get; set; }

        // Navigation property
        public virtual ICollection<Property>? Properties { get; set; }
    }
}
