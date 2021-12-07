using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Admin.Service.Interfaces
{
    public interface IMessagingEventService 
    {
        Task<IEnumerable<MessageEvents>> GetMessageEvent(MessageEvents events);
        Task<int> AddEditMessageeventdata(MessageEvents messageEvents);
        Task<int> SaveMessageEvent(SaveMessagEvent ids);
    }
}
