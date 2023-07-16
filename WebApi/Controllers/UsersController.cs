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
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UsersController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        // GET: api/Users?pageIndex=0&pageSize=10&sortColumn=name&sortOrder=asc
        [HttpGet]
        public async Task<ActionResult<ApiResult<UserDto>>?> GetUsers(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            var users = await _userService.GetUsersAsync();
            var source = _mapper.ProjectTo<UserDto>(users);

            return await ApiResult<UserDto>.CreateAsync(
                source,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>?> GetUser(int id)
        {
            if (_userService == null)
            {
              return NotFound();
            }
           
            var user = await _userService.GetUserAsync(id);

            if (user == null)
            {
                return NotFound();
            }
            var userDto = _mapper.Map<UserDto>(user);

            return userDto;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserDto userDto)
        {
            if (id != userDto.Id)
            {
                return BadRequest();
            }

            if (!_userService.UserExists(id))
            {
                return NotFound();
            }
            var user = _mapper.Map<User>(userDto);
            await _userService.UpdateUserAsync(id, user);

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserDto>> PostUser(UserDto userDto)
        {
            User user;

            if (userDto != null) 
            {
                user = _mapper.Map<User>(userDto);

                await _userService.CreateUserAsync(user);
            }
            else
            {
                return BadRequest();
            }

            userDto = _mapper.Map<UserDto>(user);
            return CreatedAtAction("GetUser", new { id = userDto.Id }, userDto);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _userService.DeleteUserAsync(id);

            return NoContent();
        }

        [HttpPost]
        [Route("IsDupeUser")]
        public bool IsDupeUser(UserDto userDto)
        {
            var user = _mapper.Map<User>(userDto);

            return _userService.IsDupeUser(user);
        }
    }
}
