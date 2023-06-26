using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Data.Models
{
    [Table("Roles")]
    public class Role
    {
        [Key]
        [Required]
        public int Id { get; set; }

        /// <summary>
        /// Name (in UTF8 format)
        /// </summary>
        [Required, StringLength(50)]
        public required string Name { get; set; }

        [ForeignKey("RoleId")]
        public required virtual ICollection<User> Users { get; set; }
    }
}
