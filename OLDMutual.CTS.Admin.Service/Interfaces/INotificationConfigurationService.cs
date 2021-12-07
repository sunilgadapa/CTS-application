using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Admin.Service.Interfaces
{
    public interface INotificationConfigurationService
    {
        Task<IEnumerable<UserDto>> GetUsers();
        Task<IEnumerable<NotificationConfigDto>> GetUsers(NotificationConfigDto data);
        Task<int> AddRoleAndUser(NotificationConfigDto data);
        Task<int> SaveChanges(NotificationConfigDto data);
        Task<IEnumerable<NotificationTemplateDto>> GetNotificationTemplate(NotificationTemplateDto data);
        Task<int> SaveNotificationTemplate(NotificationTemplateDto data);
        Task<IEnumerable<MessageEvents>> GetEventsByTaxIds(int taxId);
        Task<IEnumerable<LookupData>> GetEventAssociatedTaxData();
    }
}
