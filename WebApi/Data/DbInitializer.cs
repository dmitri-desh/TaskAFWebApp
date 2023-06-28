using WebApi.Data.Models;

namespace WebApi.Data
{
    public class DbInitializer
    {
        public async static void Initialize(ApplicationDbContext context)
        {
            context.Database.EnsureCreated();

            if (!context.Set<Role>().Any() && !context.Set<User>().Any())
            {
                var emptyUsers = new List<User>();
                //roles
                var superAdmin = new Role { Name = "Super Admin", Users = emptyUsers };
                var admin = new Role { Name = "Admin", Users = emptyUsers };
                var manager = new Role { Name = "Manager", Users = emptyUsers };
                var moderator = new Role { Name = "Moderator", Users = emptyUsers };
                var customer = new Role { Name = "Customer", Users = emptyUsers };

                var roles = new List<Role>()
                {
                    superAdmin,
                    admin,
                    manager,
                    moderator,
                    customer
                };

                await context.Set<Role>().AddRangeAsync(roles);

                //users
                var users = new User[]
                {
                    new User{ Name = "User 01", Roles = new List<Role> { superAdmin } },
                    new User{ Name = "User 02", Roles = new List<Role> { admin } },
                    new User{ Name = "User 03", Roles = new List<Role> { manager } },
                    new User{ Name = "User 04", Roles = new List<Role> { moderator } },
                    new User{ Name = "User 05", Roles = new List<Role> { customer } },
                    new User{ Name = "User 06", Roles = new List<Role> { manager, customer } },
                    new User{ Name = "User 07", Roles = new List<Role> { moderator, customer } },
                    new User{ Name = "User 08", Roles = new List<Role> { admin, customer } },
                };

                await context.Set<User>().AddRangeAsync(users);
            };

            context.SaveChanges();
        }
    }
}
