using Microsoft.EntityFrameworkCore;
using NuGet.Packaging;
using WebApi.Data;
using WebApi.Data.Models;
using WebApi.Services.Interfaces;

namespace WebApi.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool?> CreateUserAsync(User user)
        {
            if (_context.Users == null)
            {
                return false;
            }

            int result = 0;

            if (user != null)
            {
                var roles = new List<Role>();
                if (user.Roles != null)
                {
                    foreach (var role in user.Roles)
                    {
                        var roleToAdd = await _context.Roles.FirstOrDefaultAsync(r => r.Id == role.Id);
                        if (roleToAdd != null)
                        {
                            roles.Add(roleToAdd);
                        }
                    }

                    user.Roles.Clear();
                    user.Roles.AddRange(roles);
                }

                await _context.Users.AddAsync(user);

                result = await _context.SaveChangesAsync();
            }
            else
            {
                return false;
            }

            return result == 1;
        }

        public async Task<bool?> DeleteUserAsync(int id)
        {
            if (_context.Users == null)
            {
                return false;
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return false;
            }

            if (user.Roles != null)
            {
                user.Roles.Clear();
            }

            _context.Users.Remove(user);
            
            return 1 == await _context.SaveChangesAsync();
        }

        public async Task<User?> GetUserAsync(int id)
        {
            return await _context.Users
                .Include(r => r.Roles)
                .FirstOrDefaultAsync(user => user.Id == id);
        }

        public Task<IQueryable<User>?> GetUsersAsync()
        {
            return Task.FromResult<IQueryable<User>?>(_context.Users?.Include(r => r.Roles));
        }

        public async Task<bool?> UpdateUserAsync(int id, User user)
        {
            var userToUpdate = await _context.Users
                .Include(r => r.Roles)
                .FirstOrDefaultAsync(user => user.Id == id);

            int result = 0;

            if (userToUpdate != null)
            {
                _context.Entry(userToUpdate).CurrentValues.SetValues(user);
                _context.Entry(userToUpdate).State = EntityState.Modified;

                //Delete existing roles
                userToUpdate.Roles.Clear();

                //Add roles to updating User
                foreach (var role in user.Roles)
                {
                    var roleToAdd = await _context.Roles.FirstOrDefaultAsync(r => r.Id == role.Id);
                    if (roleToAdd != null)
                    {
                        userToUpdate.Roles.Add(roleToAdd);
                    }
                }
            }

            try
            {
                result = await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }

            return result == 1;
        }

        public bool UserExists(int id)
        {
            bool result = (_context.Users?.Any(e => e.Id == id)).GetValueOrDefault();

            return result;
        }

        public bool IsDupeUser(User user)
        {
            return _context.Users.Any(e => e.Name == user.Name && e.Id != user.Id);
        }
    }
}
