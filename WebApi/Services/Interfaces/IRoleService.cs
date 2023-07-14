using WebApi.Data.Models;

namespace WebApi.Services.Interfaces
{
    public interface IRoleService
    {
        Task<IQueryable<Role>?> GetRolesAsync();
        Task<Role?> GetRoleAsync(int id);
        Task<bool?> CreateRoleAsync(Role role);
        Task<bool?> UpdateRoleAsync(int id, Role role);
        Task<bool?> DeleteRoleAsync(int id);
        bool RoleExists(int id);
        bool IsDupeRole(string fieldName, string fieldValue, int roleId);
    }
}
