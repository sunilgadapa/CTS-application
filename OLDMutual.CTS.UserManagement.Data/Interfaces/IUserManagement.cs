using OLDMutual.CTS.UserManagement.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace OLDMutual.CTS.UserManagement.Data.Interfaces
{
    public interface IUserManagement: IDisposable
    {
        Task<Tuple<IEnumerable<UserManagementDto>,int>> GetUsers(SearchUsersDto user);
        Task<int> AddEditUser(DataTable dtUserRoles, DataTable dtLookupEntities);
        Task<int> DeleteUser(DataTable dt);      
        Task<IEnumerable<RolesDto>> GetAllRoles();
        Task<string[]> GetEntitiesByRole(DataTable dt);
    }
}
