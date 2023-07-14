using Microsoft.AspNetCore.Mvc;
using WebApi.Data;
using WebApi.Data.Models;
using WebApi.Services.Interfaces;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/Users?pageIndex=0&pageSize=10&sortColumn=name&sortOrder=asc
        [HttpGet]
        public async Task<ActionResult<ApiResult<User>>?> GetUsers(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            var source = await _userService.GetUsersAsync();

            return await ApiResult<User>.CreateAsync(
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
        public async Task<ActionResult<User>?> GetUser(int id)
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

            if (!_userService.UserExists(id))
            {
                return NotFound();
            }

            await _userService.UpdateUserAsync(id, user);

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            if (user != null) 
            {
                await _userService.CreateUserAsync(user);
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
            await _userService.DeleteUserAsync(id);

            return NoContent();
        }

        [HttpPost]
        [Route("IsDupeUser")]
        public bool IsDupeUser(User user)
        {
            return _userService.IsDupeUser(user);
        }
    }
}
