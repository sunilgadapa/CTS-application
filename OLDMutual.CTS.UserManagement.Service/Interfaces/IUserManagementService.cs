using OLDMutual.CTS.UserManagement.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.UserManagement.Service.Interfaces
{
    public interface IUserManagementService
    {
        Task<IEnumerable<UserManagementDto>> GetUsers(SearchUsersDto user);
        Task<int> AddEditUser(UserManagementDto user);
        Task<int> DeleteUser(DeleteUserDto deleteUserDto);
        public bool DoesUserExist(string userName);
        Task<IEnumerable<RolesDto>> GetAllRoles();
        Task<string[]> GetEntitiesByRole(AddUser addUser);
    }
}
