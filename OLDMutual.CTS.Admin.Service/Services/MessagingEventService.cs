using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.Admin.Data.Interfaces;
using OLDMutual.CTS.Admin.Domain.Models;
using OLDMutual.CTS.Admin.Service.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Admin.Service.Services
{
    public class MessagingEventService : IMessagingEventService
    {
        private readonly IMessagingEvent _messagingEvent;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MessagingEventService(IMessagingEvent messagingEvent, IHttpContextAccessor httpContextAccessor)
        {
            _messagingEvent = messagingEvent;
            _httpContextAccessor = httpContextAccessor;
        }
        /*  
        .......................................................................................................
        * This is the AddEditMessageEvent service method
        * @param messageEvents is used to get the Messaging Event data in JSON format as a method param
        * AddEditMessageEventAsync() is used to add or edit the messagin event for selected tax type
        .......................................................................................................
        */
        public async Task<int> AddEditMessageeventdata(MessageEvents messageEvents)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _messagingEvent.AddEditMessageeventdata(messageEvents, userName);
        }
        /*  
        .......................................................................................................
        * This is the GetMessageEvent service method
        * @param message is used to get the Messaging Event data in JSON format as a method param      
        * GetMessageEvent() is used to get the messaging events specific to the tax type
        .......................................................................................................
        */
        public async Task<IEnumerable<MessageEvents>> GetMessageEvent(MessageEvents events)
        {
            var result = await _messagingEvent.GetMessageEvent(events);
            foreach (MessageEvents item in result.Item1)
            {
                item.totalrows = result.Item2;
            }
            return result.Item1;
        }
        /*  
        .......................................................................................................
        * This is the SaveMessageEvent service method
        * @param ids is used to get the Messaging Event ids in a JSON format as a request body      
        * SaveMessageEvent() is used to active/inactive the selected event ids
        .......................................................................................................
        */
        public async Task<int> SaveMessageEvent(SaveMessagEvent ids)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            DataTable dt = new DataTable();
            dt.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < ids.Ids.Length; i++)
            {
                row = dt.NewRow();
                row["ID"] = ids.Ids[i];
                dt.Rows.Add(row);
            }
            return await _messagingEvent.SaveMessageEvent(dt, ids, userName);
        }
    }
}
