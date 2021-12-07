using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Admin.Data.Interfaces
{
    public interface INotificationConfiguration:IDisposable
    {
        Task<IEnumerable<UserDto>> GetUsers();
        Task<IEnumerable<NotificationConfigDto>> GetUsers(NotificationConfigDto data);
        Task<int> AddRoleAndUser(NotificationConfigDto data, string userName);
        /// <summary>
        /// Save change for notification configuration
        /// </summary>
        /// <param name="dtUserToAdd">dtUserToAdd</param>
        /// <param name="dtRoleToAdd">dtRoleToAdd</param>
        /// <param name="userName">userName</param>
        /// <param name="eventId">eventId</param>
        /// <returns></returns>
        Task<int> SaveChanges(DataTable dtUserToAdd, DataTable dtRoleToAdd, string userName, int eventId);
        Task<IEnumerable<NotificationTemplateDto>> GetNotificationTemplate(NotificationTemplateDto data);
        Task<int> SaveNotificationTemplate(NotificationTemplateDto data, string userName);
        Task<IEnumerable<MessageEvents>> GetEventsByTaxIds(int taxId);
        Task<IEnumerable<LookupData>> GetEventAssociatedTaxData();
    }
}
