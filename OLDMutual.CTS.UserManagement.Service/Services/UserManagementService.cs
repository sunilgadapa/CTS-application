using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.UserManagement.Data.Interfaces;
using OLDMutual.CTS.UserManagement.Domain.Models;
using OLDMutual.CTS.UserManagement.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.UserManagement.Service.Services
{
    public class UserManagementService : IUserManagementService
    {
        private readonly IUserManagement _userManagement;
        public UserManagementService(IUserManagement userManagement)
        {
            _userManagement = userManagement;
        }
        /*  
       .......................................................................................................
       * This is the AddEditUser method
       * @param user is used to get user specific JSON body
       * AddEditUser() is used to add or update the user
       .......................................................................................................
       */
        public async Task<int> AddEditUser(UserManagementDto user)
        {

            var userName = string.Empty;
            var eMail = string.Empty;
            using (var domainContext = new PrincipalContext(ContextType.Domain, "OMCORE"))
            {
                using (var foundUser = UserPrincipal.FindByIdentity(domainContext, IdentityType.SamAccountName, user.UserId))
                {
                    userName = foundUser.DisplayName;
                    eMail = foundUser.EmailAddress;
                }
            }

            var UserArray = userName.Split(' ').ToArray();
            DataTable dtUserRole = new DataTable();
            DataTable dtLookupEntities = new DataTable();
            if (user.RoleId.Length > 0 && user.TaxModuleId.Length > 0)
            {

                dtUserRole.Columns.Add("UserId", typeof(string));
                dtUserRole.Columns.Add("UserName", typeof(string));
                dtUserRole.Columns.Add("FirstName", typeof(string));
                dtUserRole.Columns.Add("LastName", typeof(string));
                dtUserRole.Columns.Add("Email", typeof(string));
                dtUserRole.Columns.Add("DateOfExpiry", typeof(DateTime));
                dtUserRole.Columns.Add("Ids", typeof(int));
                dtUserRole.Columns.Add("TaxModuleId", typeof(int));
                DataRow row;
                for (int i = 0; i < user.RoleId.Length; i++)
                {
                    for (int j = 0; j < user.TaxModuleId.Length; j++)
                    {
                        row = dtUserRole.NewRow();
                        row["UserId"] = user.UserId;
                        row["UserName"] = userName;
                        row["FirstName"] = UserArray[0].ToString();
                        row["LastName"] = UserArray[1].ToString();
                        row["Email"] = eMail;
                        row["DateOfExpiry"] = user.DateOfExpiry;
                        row["Ids"] = user.RoleId[i];
                        row["TaxModuleId"] = user.TaxModuleId[j];
                        dtUserRole.Rows.Add(row);
                    }
                }
            }
            if (user.LookupEntities.Length > 0)
            {
                dtLookupEntities.Columns.Add("ID", typeof(int));
                DataRow row;
                for (int i = 0; i < user.LookupEntities.Length; i++)
                {
                    row = dtLookupEntities.NewRow();
                    row["ID"] = user.LookupEntities[i];
                    dtLookupEntities.Rows.Add(row);
                }
            }
            return await _userManagement.AddEditUser(dtUserRole, dtLookupEntities);


        }
        /*  
       .......................................................................................................
       * This is the DeleteUser method
       * @param deleteUserDto is used to get user specific JSON body
       * DeleteUser() is used to delete the onboarded user
       .......................................................................................................
       */
        public async Task<int> DeleteUser(DeleteUserDto deleteUserDto)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < deleteUserDto.UserIds.Length; i++)
            {
                row = dt.NewRow();
                row["ID"] = deleteUserDto.UserIds[i];
                dt.Rows.Add(row);
            }
            return await _userManagement.DeleteUser(dt);
        }
        /*  
        .......................................................................................................
        * This is the DoesUserExist method
        * @param userName is used to get userName as a request header
        * DoesUserExist() is used to check user exist in AD or not
        .......................................................................................................
        */
        public bool DoesUserExist(string userName)
        {
            using (var domainContext = new PrincipalContext(ContextType.Domain, "OMCORE"))
            {
                using (var foundUser = UserPrincipal.FindByIdentity(domainContext, IdentityType.SamAccountName, userName))
                {
                    return foundUser != null;
                }
            }
        }
        /*  
       .......................................................................................................
       * This is the GetAllRoles method        
       * GetAllRoles() is used to get all roles
       .......................................................................................................
       */
        public async Task<IEnumerable<RolesDto>> GetAllRoles()
        {
            return await _userManagement.GetAllRoles();
        }
        /*  
        .......................................................................................................
        * This is the GetEntitiesByRole method
        * @param addUser is used to get JSON body with user data
        * GetEntitiesByRole() is used to get entities by user role
        .......................................................................................................
        */
        public async Task<string[]> GetEntitiesByRole(AddUser addUser)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < addUser.RoleId.Length; i++)
            {
                row = dt.NewRow();
                row["ID"] = addUser.RoleId[i];
                dt.Rows.Add(row);
            }
            return await _userManagement.GetEntitiesByRole(dt);
        }
        /*  
      .......................................................................................................
      * This is the GetUsers method
      * @param user is used to get JSON body with filter conditions
      * GetUsers() is used to get all users based on the filter criteria
      .......................................................................................................
      */
        public async Task<IEnumerable<UserManagementDto>> GetUsers(SearchUsersDto user)
        {
            var result = await _userManagement.GetUsers(user);
            List<UserManagementDto> lstUserManagementDto = new List<UserManagementDto>();
            foreach (var roleId in result.Item1)
            {
                UserManagementDto notificationConfigDtos = new UserManagementDto();
                notificationConfigDtos.UserId = roleId.UserId;
                notificationConfigDtos.UserName = roleId.UserName;
                notificationConfigDtos.DateOfExpiry = roleId.DateOfExpiry;
                notificationConfigDtos.RolesIds = roleId.RolesIds;
                if (!string.IsNullOrWhiteSpace(roleId.RoleNames))
                {
                    notificationConfigDtos.strRoleNames = roleId.RoleNames.Split(',');
                }
                else
                {
                    notificationConfigDtos.strRoleNames = null;
                }
                if (!string.IsNullOrWhiteSpace(roleId.SrcSymNames))
                {
                    notificationConfigDtos.strSrcSyms = roleId.SrcSymNames.Split(',');
                }
                else
                {
                    notificationConfigDtos.strSrcSyms = null;
                }
                if (!string.IsNullOrWhiteSpace(roleId.FundEntityNames))
                {
                    notificationConfigDtos.strFundEntities = roleId.FundEntityNames.Split(',');
                }
                else
                {
                    notificationConfigDtos.strFundEntities = null;
                }
                notificationConfigDtos.TaxIds = roleId.TaxIds;
                notificationConfigDtos.User = roleId.User;
                notificationConfigDtos.TaxNames = roleId.TaxNames;
                notificationConfigDtos.SrcSymIds = roleId.SrcSymIds;
                notificationConfigDtos.FundEntityIds = roleId.FundEntityIds;
                notificationConfigDtos.BrandIds = roleId.BrandIds;
                notificationConfigDtos.BrandNames = roleId.BrandNames;
                notificationConfigDtos.status_flag = roleId.status_flag;
                notificationConfigDtos.UserStatus = roleId.UserStatus;
                notificationConfigDtos.RowsAffected = result.Item2;
                lstUserManagementDto.Add(notificationConfigDtos);
            }
            return lstUserManagementDto;
        }
    }
}
