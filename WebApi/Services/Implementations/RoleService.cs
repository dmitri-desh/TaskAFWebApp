using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using WebApi.Data;
using WebApi.Data.Models;
using WebApi.Services.Interfaces;

namespace WebApi.Services.Implementations
{
    public class RoleService : IRoleService
    {
        private readonly ApplicationDbContext _context;

        public RoleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool?> CreateRoleAsync(Role role)
        {
            if (_context.Roles == null)
            {
                return false;
            }

            if (role != null) 
            { 
                await _context.Roles.AddAsync(role);
                
                return 1 == await _context.SaveChangesAsync();
            }

            return false;
        }

        public async Task<bool?> DeleteRoleAsync(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return false;
            }

            _context.Roles.Remove(role);

            return 1 == await _context.SaveChangesAsync();
        }

        public async Task<Role?> GetRoleAsync(int id)
        {
            return await _context.Roles.FindAsync(id);
        }

        public Task<IQueryable<Role>?> GetRolesAsync()
        {
            return Task.FromResult<IQueryable<Role>?>(_context.Roles.Include(u => u.Users));
        }

        public bool IsDupeRole(string fieldName, string fieldValue, int roleId)
        {
            return _context.Roles.Any(string.Format("{0} == @0 && Id != @1", fieldName), fieldValue, roleId);
        }

        public bool RoleExists(int id)
        {
            return (_context.Roles?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        public async Task<bool?> UpdateRoleAsync(int id, Role role)
        {
            var roleToUpdate = await _context.Roles
                .FirstOrDefaultAsync(role => role.Id == id);

            int result = 0;

            if (roleToUpdate != null)
            {
                _context.Entry(roleToUpdate).CurrentValues.SetValues(role);
                _context.Entry(roleToUpdate).State = EntityState.Modified;
            }

            try
            {
                result = await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleExists(id))
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
    }
}
