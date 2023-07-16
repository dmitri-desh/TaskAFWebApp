using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebApi.Data;
using WebApi.Data.Models;
using WebApi.Services.Interfaces;
using WebApi.DTO;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roleService;
        private readonly IMapper _mapper;

        public RolesController(IRoleService roleService, IMapper mapper)
        {
            _roleService = roleService;
            _mapper = mapper;
        }

        // GET: api/Roles?pageIndex=0&pageSize=10&sortColumn=name&sortOrder=asc
        [HttpGet]
        public async Task<ActionResult<ApiResult<RoleDto>>?> GetRoles(
            int pageIndex = 0, 
            int pageSize = 10, 
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            var roles = await _roleService.GetRolesAsync();
            var source = _mapper.ProjectTo<RoleDto>(roles);

            return await ApiResult<RoleDto>.CreateAsync(
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
        public async Task<ActionResult<RoleDto>> GetRole(int id)
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

            var roleDto = _mapper.Map<RoleDto>(role);

            return roleDto;
        }

        // PUT: api/Roles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRole(int id, RoleDto roleDto)
        {
            if (id != roleDto.Id)
            {
                return BadRequest();
            }

            if (!_roleService.RoleExists(id))
            {
                return NotFound();
            }

            var role = _mapper.Map<Role>(roleDto);
            await _roleService.UpdateRoleAsync(id, role);

            return NoContent();
        }

        // POST: api/Roles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RoleDto>> PostRole(RoleDto roleDto)
        {
            Role role;

            if (roleDto != null)
            {
                role = _mapper.Map<Role>(roleDto);
                await _roleService.CreateRoleAsync(role);
            }
            else
            {
                return BadRequest();
            }

            roleDto = _mapper.Map<RoleDto>(role);

            return CreatedAtAction("GetRole", new { id = roleDto.Id }, roleDto);
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
            return ApiResult<RoleDto>.IsValidProperty(fieldName, true)
                && _roleService.IsDupeRole(fieldName, fieldValue, roleId);
        }
    }
}
