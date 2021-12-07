using Dapper;
using OLDMutual.CTS.UserManagement.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.UserManagement.Data.Interfaces;
using OLDMutual.CTS.UserManagement.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace OLDMutual.CTS.UserManagement.Data.Data_Access_Layer
{
    public class UserManagementDao : IUserManagement
    {
        private readonly IDapper _dapper;
        public UserManagementDao(IDapper dapper)
        {
            _dapper = dapper;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            // Cleanup
        }
        /*  
       .......................................................................................................
       * This is the AddEditUser DAO method
       * @param dtUserRoles and @param dtLookupEntities are used to get user specific data tables
       * AddEditUser() is used to add or update the user
       .......................................................................................................
       */
        public async Task<int> AddEditUser(DataTable dtUserRoles, DataTable dtLookupEntities)
        {
            int result = 0;
            if (dtUserRoles.Rows.Count > 0)
            {
                string sp = "SP_InsertUpdateDeleteUser";
                DynamicParameters param = new DynamicParameters();
                param.Add("@ACTION", "E");
                param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
                param.Add("@dtInsertUpdateRoles", dtUserRoles.AsTableValuedParameter());
                param.Add("@dtInsertUpdateLookupEntity", dtLookupEntities.AsTableValuedParameter());
                result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            }
            return result;

        }
        /*  
       .......................................................................................................
       * This is the DeleteUser DAO method
       * @param dt is used to get data table with user Ids to delete
       * DeleteUser() is used to delete the onboarded user
       .......................................................................................................
       */
        public async Task<int> DeleteUser(DataTable dt)
        {
            int result = 0;
            string sp = "SP_InsertUpdateDeleteUser";
            DynamicParameters param = new DynamicParameters();
            param.Add("@dtUSERSTODELETE", dt.AsTableValuedParameter());
            param.Add("@ACTION", "D");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
        .......................................................................................................
        * This is the GetEntitiesByRole DAO method
        * @param dt is used to get data table with role ids
        * GetEntitiesByRole() is used to get entities by user role
        .......................................................................................................
        */
        public async Task<string[]> GetEntitiesByRole(DataTable dt)
        {
            string sp = "SP_GetVisibleEntities";
            DynamicParameters param = new DynamicParameters();
            param.Add("@dtRoles", dt.AsTableValuedParameter());
            var result = await Task.FromResult(_dapper.GetAll<string>(sp, param, commandType: CommandType.StoredProcedure));
            return result.ToArray();
        }
        /*  
      .......................................................................................................
      * This is the GetUsers DAO method
      * @param user is used to get JSON body with filter conditions
      * GetUsers() is used to get all users based on the filter criteria
      .......................................................................................................
      */
        public async Task<Tuple<IEnumerable<UserManagementDto>, int>> GetUsers(SearchUsersDto user)
        {
            string sp = "SP_GETAllUserdetails";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Page", user.Page);
            param.Add("@Size", user.Size);
            param.Add("@search", user.SearchText);
            param.Add("@Status", user.Status);
            param.Add("@RowsAffected", dbType: DbType.Int32, direction: ParameterDirection.Output);
            var result = await Task.FromResult(_dapper.GetAll<UserManagementDto>(sp, param, commandType: CommandType.StoredProcedure));
            return Tuple.Create(result, param.Get<int>("@RowsAffected"));
        }
        /*  
       .......................................................................................................
       * This is the GetAllRoles DAO method        
       * GetAllRoles() is used to get all roles
       .......................................................................................................
       */
        public async Task<IEnumerable<RolesDto>> GetAllRoles()
        {
            string sp = "SP_GetAllRoles";
            var result = await Task.FromResult(_dapper.GetAll<RolesDto>(sp, null, commandType: CommandType.StoredProcedure));
            return result;
        }
    }
}

