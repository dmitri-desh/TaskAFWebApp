using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApi.Data.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        [Required]
        public int Id { get; set; }

        /// <summary>
        /// Name (in UTF8 format)
        /// </summary>
        [Required, StringLength(150)]
        public required string Name { get; set; }

        [ForeignKey("UserId")]
        public ICollection<Role>? Roles { get; set; }
    }
}
