using AutoMapper;
using WebApi.Data.Models;
using WebApi.DTO;

namespace WebApi.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Role, RoleDto>().ReverseMap();
        }
    }
}
