using Microsoft.AspNetCore.Mvc;
using WebApi.Data;
using WebApi.Data.Models;
using WebApi.Services.Interfaces;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RolesController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        // GET: api/Roles?pageIndex=0&pageSize=10&sortColumn=name&sortOrder=asc
        [HttpGet]
        public async Task<ActionResult<ApiResult<Role>>?> GetRoles(
            int pageIndex = 0, 
            int pageSize = 10, 
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            var source = await _roleService.GetRolesAsync();

            return await ApiResult<Role>.CreateAsync(
                 source,
                 pageIndex,
                 pageSize,
                 sortColumn,
                 sortOrder,
                 filterColumn,
                 filterQuery);
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetRole(int id)
        {
          if (_roleService == null)
          {
              return NotFound();
          }
            var role = await _roleService.GetRoleAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            return role;
        }

        // PUT: api/Roles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRole(int id, Role role)
        {
            if (id != role.Id)
            {
                return BadRequest();
            }

            if (!_roleService.RoleExists(id))
            {
                return NotFound();
            }

            await _roleService.UpdateRoleAsync(id, role);

            return NoContent();
        }

        // POST: api/Roles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Role>> PostRole(Role role)
        {
            if (role != null)
            {
                await _roleService.CreateRoleAsync(role);
            }
            else
            {
                return BadRequest();
            }

            return CreatedAtAction("GetRole", new { id = role.Id }, role);
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            await _roleService.DeleteRoleAsync(id);

            return NoContent();
        }

        [HttpPost]
        [Route("IsDupeField")]
        public bool IsDupeField(int roleId, string fieldName, string fieldValue)
        {
            return ApiResult<Role>.IsValidProperty(fieldName, true)
                && _roleService.IsDupeRole(fieldName, fieldValue, roleId);
        }
    }
}
