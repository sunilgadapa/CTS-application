using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Admin.Data.Interfaces
{
    public interface IMessagingEvent:IDisposable
    {
        Task<Tuple<IEnumerable<MessageEvents>, int>> GetMessageEvent(MessageEvents events);
        Task<int> AddEditMessageeventdata(MessageEvents messagingEvent, string userName);
        Task<int> SaveMessageEvent(DataTable dt, SaveMessagEvent ids, string userName);
    }
}
