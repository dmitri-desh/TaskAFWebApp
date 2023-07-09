using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using Azure.Core;
using Humanizer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using NuGet.Packaging;
using WebApi.Data;
using WebApi.Data.Models;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<ApiResult<User>>> GetUsers(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            return await ApiResult<User>.CreateAsync(
                source: _context.Users.AsNoTracking(),
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
          if (_context.Users == null)
          {
              return NotFound();
          }
            var user = await _context.Users
                .Include(r => r.Roles)
                .FirstOrDefaultAsync(user => user.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            if (!UserExists(id))
            {
                return NotFound();
            }

            var userToUpdate = await _context.Users
                .Include(r => r.Roles)
                .FirstOrDefaultAsync(user => user.Id == id);

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
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            if (_context.Users == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Users'  is null.");
            }

            if (user != null) 
            {
                var roles = new List<Role>();
                if (user.Roles != null)
                {
                    foreach(var role in user.Roles)
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

                _context.Users.Add(user);

                await _context.SaveChangesAsync();
            }
            else
            {
                return BadRequest();
            }

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            if (user.Roles != null)
            {
                user.Roles.Clear();
            }
            
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return (_context.Users?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        [HttpPost]
        [Route("IsDupeUser")]
        public bool IsDupeUser(User user)
        {
            return _context.Users.Any(e => e.Name == user.Name && e.Id != user.Id );
        }
    }
}
