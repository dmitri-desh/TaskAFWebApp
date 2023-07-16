namespace WebApi.DTO
{
    public class UserDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public ICollection<RoleDto>? Roles { get; set; }
    }
}
