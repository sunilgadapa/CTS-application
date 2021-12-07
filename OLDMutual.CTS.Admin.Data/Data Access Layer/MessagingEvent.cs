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
    public class MessagingEvent : IMessagingEvent
    {
        private readonly IDapper _dapper;
        public MessagingEvent(IDapper dapper)
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
        * This is the AddEditMessageEvent AddEditMessageeventdata method
        * @param messageEvents is used to get the Messaging Event data in JSON format as a method param
        * @param username is used to get the user name for the current operation
        * AddEditMessageeventdata() is used to add or edit the messagin event for selected tax type
        .......................................................................................................
        */
        public async Task<int> AddEditMessageeventdata(MessageEvents messagingEvent, string userName)
        {
            int result;
            string sp = "SP_MessageEvent";
            DynamicParameters param = new DynamicParameters();
            param.Add("@messaging_event_id", messagingEvent.messaging_event_id);
            param.Add("@messaging_event", messagingEvent.messaging_event);
            param.Add("@message_event_type", messagingEvent.message_event_type);
            param.Add("@messaging_event_description", messagingEvent.messaging_event_description);
            param.Add("@tax_module_id", messagingEvent.tax_module_id);
            param.Add("@username", userName);
            param.Add("@ACTION", (messagingEvent.messaging_event_id > 0) ? "U" : "I");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }
        /*  
        .......................................................................................................
        * This is the GetMessageEvent DAO method
        * @param message is used to get the Messaging Event data in JSON format as a method param      
        * GetMessageEvent() is used to get the messaging events specific to the tax type
        .......................................................................................................
        */
        public async Task<Tuple<IEnumerable<MessageEvents>, int>> GetMessageEvent(MessageEvents events)
        {
            string sp = "SP_MessageEvent";
            DynamicParameters param = new DynamicParameters();
            param.Add("@tax_module_id", events.tax_module_id);
            param.Add("@Page", events.Page);
            param.Add("@Size", events.Size);
            param.Add("@searchtext", events.searchtext);
            param.Add("@ACTION", "G");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            var result = await Task.FromResult(_dapper.GetAll<MessageEvents>(sp, param, commandType: CommandType.StoredProcedure));
            return Tuple.Create(result, param.Get<int>("@RowsAffected"));

        }
        /*  
        .......................................................................................................
        * This is the SaveMessageEvent DAO method
        * @param ids is used to get the Messaging Event ids in a JSON format as a request body      
        * SaveMessageEvent() is used to active/inactive the selected event ids
        .......................................................................................................
        */
        public async Task<int> SaveMessageEvent(DataTable dt, SaveMessagEvent ids, string userName)
        {
            int result;
            string sp = "SP_MessageEvent";
            DynamicParameters param = new DynamicParameters();
            param.Add("@dtmessageevent", dt.AsTableValuedParameter());
            param.Add("@ACTION", "S");
            param.Add("@tax_module_id", ids.tax_module_id);
            param.Add("@Page", ids.page);
            param.Add("@Size", ids.size);
            param.Add("@username", userName);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }

    }
}
