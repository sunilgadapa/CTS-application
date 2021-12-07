using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.Admin.Data.Interfaces;
using OLDMutual.CTS.Admin.Domain.Models;
using OLDMutual.CTS.Admin.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Admin.Service.Services
{
    public class NotificationConfigurationService : INotificationConfigurationService
    {
        private readonly INotificationConfiguration _notificationConfiguration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public NotificationConfigurationService(INotificationConfiguration notificationConfiguration, IHttpContextAccessor httpContextAccessor)
        {
            _notificationConfiguration = notificationConfiguration;
            _httpContextAccessor = httpContextAccessor;
        }
        /*  
        .......................................................................................................
        * This is the AddRoleOrUser service method         
        * @param data is used to get the data in JSON format as a method param
        * AddRoleOrUser() is used to add users or roles for selected tax type and messaging event
        .......................................................................................................
        */
        public async Task<int> AddRoleAndUser(NotificationConfigDto data)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _notificationConfiguration.AddRoleAndUser(data, userName);
        }
        /*  
        .......................................................................................................
        * This is the GetEventAssociatedTaxData service method     
        * @param data is used to get the data in JSON format as a method param
        * GetEventAssociatedTaxData() is used to get the events which are associated with tax types 
        .......................................................................................................
        */
        public async Task<IEnumerable<LookupData>> GetEventAssociatedTaxData()
        {
            return await _notificationConfiguration.GetEventAssociatedTaxData();
        }
        /*  
        .......................................................................................................
        * This is the GetEventsByTaxIds service method     
        * @param taxId is used to get the tax idt as a method param
        * GetEventsByTaxIds() is used to get the events by tax types 
        .......................................................................................................
        */
        public async Task<IEnumerable<MessageEvents>> GetEventsByTaxIds(int taxId)
        {
            return await _notificationConfiguration.GetEventsByTaxIds(taxId);
        }
        /*  
       .......................................................................................................
       * This is the GetNotificationTemplate service method       
       * @param data is used to get the data in JSON format as a method param  
       * GetNotificationTemplate() is used to get the template for selected notification type, tax type and messaging event
       .......................................................................................................
       */
        public async Task<IEnumerable<NotificationTemplateDto>> GetNotificationTemplate(NotificationTemplateDto data)
        {
            return await _notificationConfiguration.GetNotificationTemplate(data);
        }
        /*  
        .......................................................................................................
        * This is the GetUsers service method       
        * @param data is used to get the filter data in JSON format as a method param  
        * GetUsers() is used to get users available in the system for selected tax type and messaging event
        .......................................................................................................
        */
        public async Task<IEnumerable<NotificationConfigDto>> GetUsers(NotificationConfigDto data)
        {
            var result = await _notificationConfiguration.GetUsers(data);
            if (data.SearchBy.Trim().ToLower() == "role")
            {
                foreach (NotificationConfigDto item in result)
                {
                    item.strUserNames = item.UserNames.Split(',');
                }
                return result;
            }
            else
            {
                return result;
            }
        }
        /*  
       .......................................................................................................
       * This is the GetUsers service method
       * GetUsers() is used to get all user in the system
       .......................................................................................................
       */
        public async Task<IEnumerable<UserDto>> GetUsers()
        {
            return await _notificationConfiguration.GetUsers();
        }
        /*  
        .......................................................................................................
        * This is the SaveChanges service method     
        * @param data is used to get the data in JSON format as a method param  
        * SaveChanges() is used to active/inactive the users or roles for selected tax type and messaging event
        .......................................................................................................
        */
        public async Task<int> SaveChanges(NotificationConfigDto data)
        {
            DataTable dtRoleToAdd = new DataTable();
            dtRoleToAdd.Columns.Add("EventId", typeof(int));
            dtRoleToAdd.Columns.Add("RoleId", typeof(int));
            DataRow row;
            for (int j = 0; j < data.RoleArray.Length; j++)
            {
                row = dtRoleToAdd.NewRow();
                row["EventId"] = data.EventIds;
                row["RoleId"] = data.RoleArray[j];
                dtRoleToAdd.Rows.Add(row);
            }
            DataTable dtUserToAdd = new DataTable();
            dtUserToAdd.Columns.Add("EventId", typeof(int));
            dtUserToAdd.Columns.Add("UserId", typeof(int));
            DataRow newRow;
            for (int i = 0; i < data.Ids.Length; i++)
            {
                newRow = dtUserToAdd.NewRow();
                newRow["EventId"] = data.EventIds;
                newRow["UserId"] = data.Ids[i];
                dtUserToAdd.Rows.Add(newRow);

            }
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _notificationConfiguration.SaveChanges(dtUserToAdd, dtRoleToAdd, userName, data.EventIds);
        }
        /*  
        .......................................................................................................
        * This is the SaveNotificationTemplate service method    
        * @param data is used to get the data in JSON format as a request body  
        * SaveNotificationTemplate() is used to add the template for selected notification type, tax type and messaging event
        .......................................................................................................
        */
        public async Task<int> SaveNotificationTemplate(NotificationTemplateDto data)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _notificationConfiguration.SaveNotificationTemplate(data, userName);
        }
    }
}
