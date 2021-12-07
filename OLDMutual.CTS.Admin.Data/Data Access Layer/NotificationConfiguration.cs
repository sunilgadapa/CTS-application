using Dapper;
using OLDMutual.CTS.Admin.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.Admin.Data.Interfaces;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Admin.Data.Data_Access_Layer
{
    public class NotificationConfiguration : INotificationConfiguration
    {
        private readonly IDapper _dapper;

        public NotificationConfiguration(IDapper dapper)
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
        * This is the AddRoleOrUser DAO method         
        * @param data is used to get the data in JSON format as a method param
        * @param userName is used to get the user name for the current operation
        * AddRoleOrUser() is used to add users or roles for selected tax type and messaging event
        .......................................................................................................
        */
        public async Task<int> AddRoleAndUser(NotificationConfigDto data, string userName)
        {
            int result;
            string sp = "SP_AddNotificationRoleOrUser";
            DynamicParameters param = new DynamicParameters();
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            param.Add("@UserName", userName);
            param.Add("@EntityToAdd", data.EntityToAdd.Trim().ToLower());
            param.Add("@RoleId", data.RoleId);
            param.Add("@EventId", data.EventIds);
            param.Add("@UserId", data.Id);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;

        }

        /*  
        .......................................................................................................
        * This is the GetEventsByTaxIds DAO method     
        * @param taxId is used to get the tax idt as a method param
        * GetEventsByTaxIds() is used to get the events by tax types 
        .......................................................................................................
        */
        public async Task<IEnumerable<MessageEvents>> GetEventsByTaxIds(int taxId)
        {
            string sp = "SP_GetEventByTaxIds";
            DynamicParameters param = new DynamicParameters();
            param.Add("@TaxId", taxId);
            var result = await Task.FromResult(_dapper.GetAll<MessageEvents>(sp, param, commandType: CommandType.StoredProcedure));
            return result;


        }
        /*  
       .......................................................................................................
       * This is the GetNotificationTemplate DAO method       
       * @param data is used to get the data in JSON format as a method param  
       * GetNotificationTemplate() is used to get the template for selected notification type, tax type and messaging event
       .......................................................................................................
       */
        public async Task<IEnumerable<NotificationTemplateDto>> GetNotificationTemplate(NotificationTemplateDto data)
        {
            string sp = "SP_GetNotificationTemplate";
            DynamicParameters param = new DynamicParameters();
            param.Add("@NotificationTypeId", data.NotificationTypeId);
            param.Add("@MessagingEventId", data.EventId);
            var result = await Task.FromResult(_dapper.GetAll<NotificationTemplateDto>(sp, param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
        .......................................................................................................
        * This is the GetUsers DAO method       
        * @param data is used to get the filter data in JSON format as a method param  
        * GetUsers() is used to get users available in the system for selected tax type and messaging event
        .......................................................................................................
        */
        public async Task<IEnumerable<NotificationConfigDto>> GetUsers(NotificationConfigDto data)
        {
            string sp = "SP_GetUsersOnNotificationConfig";
            DynamicParameters param = new DynamicParameters();
            param.Add("@SearchBy", data.SearchBy.Trim().ToLower());
            param.Add("@TaxId", data.TaxIds);
            param.Add("@EventIds", data.EventIds);
            var result = await Task.FromResult(_dapper.GetAll<NotificationConfigDto>(sp, param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
       .......................................................................................................
       * This is the GetUsers DAO method
       * GetUsers() is used to get all user in the system
       .......................................................................................................
       */
        public async Task<IEnumerable<UserDto>> GetUsers()
        {
            string sp = "SP_GetActiveUsers";
            var result = await Task.FromResult(_dapper.GetAll<UserDto>(sp, null, commandType: CommandType.StoredProcedure));
            return result;
        }

        /// <summary>
        /// Save change for notification configuration
        /// </summary>
        /// <param name="dtUserToAdd">dtUserToAdd</param>
        /// <param name="dtRoleToAdd">dtRoleToAdd</param>
        /// <param name="userName">userName</param>
        /// <param name="eventId">eventId</param>
        /// <returns></returns>
        /*  
        .......................................................................................................
        * This is the SaveChanges DAO method     
        * @param dtUserToAdd is used to get the ids of users
        * @param dtRoleToAdd is used to get the ids of roles
        * @param userName is used to get the user name for the current operation
        * @param eventId is used to get the event id
        * SaveChanges() is used to active/inactive the users or roles for selected tax type and messaging event
        .......................................................................................................
        */
        public async Task<int> SaveChanges(DataTable dtUserToAdd, DataTable dtRoleToAdd, string userName, int eventId)
        {
            int result ;
            string sp = "SP_SaveNotificationConfiguration";
            DynamicParameters param = new DynamicParameters();
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            param.Add("@UserName", userName);
            param.Add("@EventId", eventId);
            param.Add("@dtNotificationData", dtRoleToAdd.AsTableValuedParameter());
            param.Add("@dtUserToAdd", dtUserToAdd.AsTableValuedParameter());
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
        .......................................................................................................
        * This is the SaveNotificationTemplate DAO method    
        * @param data is used to get the data in JSON format as a request body  
        * SaveNotificationTemplate() is used to add the template for selected notification type, tax type and messaging event
        .......................................................................................................
        */
        public async Task<int> SaveNotificationTemplate(NotificationTemplateDto data, string userName)
        {

            int result ;
            string sp = "SP_SaveNotificationTemplate";
            DynamicParameters param = new DynamicParameters();
            param.Add("@RowsAffected", ParameterDirection.Output);
            param.Add("@NotificationTypeId", data.NotificationTypeId);
            param.Add("@MessagingEventId", data.EventId);
            param.Add("@NotificationTemplate", data.NotificationTemplate);
            param.Add("@EffectiveDate", data.EffectiveDate);
            param.Add("@UserName", userName);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
        .......................................................................................................
        * This is the GetEventAssociatedTaxData DAO method     
        * @param data is used to get the data in JSON format as a method param
        * GetEventAssociatedTaxData() is used to get the events which are associated with tax types 
        .......................................................................................................
        */
        public async Task<IEnumerable<LookupData>> GetEventAssociatedTaxData()
        {
            string sp = "SP_GetEventAssociatedTaxData";
            var result = await Task.FromResult(_dapper.GetAll<LookupData>(sp, null, commandType: CommandType.StoredProcedure));
            return result;

        }
    }
}
