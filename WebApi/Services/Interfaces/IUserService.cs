using WebApi.Data.Models;

namespace WebApi.Services.Interfaces
{
    public interface IUserService
    {
        Task<IQueryable<User>?> GetUsersAsync();
        Task<User?> GetUserAsync(int id);
        Task<bool?> CreateUserAsync(User user);
        Task<bool?> UpdateUserAsync(int id, User user);
        Task<bool?> DeleteUserAsync(int id);
        bool UserExists(int id);
        bool IsDupeUser(User user);
    }
}
