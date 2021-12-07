using Dapper;
using OLDMutual.CTS.SnsNotification.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.SnsNotification.Data.Interfaces;
using OLDMutual.CTS.SnsNotification.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace OLDMutual.CTS.SnsNotification.Data.Data_Access_Layer
{
    public class SnsNotificationDao : ISnsNotification
    {
        private readonly IDapper _dapper;

        public SnsNotificationDao(IDapper dapper)
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

        /// <summary>
        /// Get Notification Count
        /// </summary>
        /// <param name="email"></param>
        /// <returns>Object</returns>
        public async Task<NotificationCountResult> GetNotificationCount(string email)
        {
            var notificationCountResult = new NotificationCountResult();
            string Query = "sp_get_notification_Count";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Email", email);

            var result = await Task.FromResult(_dapper.GetDataSet(Query, param, commandType: CommandType.StoredProcedure));
            foreach (DataRow row in result.Tables[0].Rows)
            {
                notificationCountResult.Count = Convert.ToInt32(row["NotificationCount"]);
            }
            return notificationCountResult;
        }

        /// <summary>
        /// Get Notification result based on user id and notification Type
        /// </summary>
        /// <param name="notificationParams">Input params for procedure</param>
        /// <returns>LIst Object</returns>
        public async Task<IEnumerable<NotificationResult>> GetNotificationResult(NotificationParams notificationParams)
        {
            
            string Query = "sp_get_notification_data";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Email", notificationParams.Email);
            param.Add("@Notification_Type", notificationParams.Notification_Type);
            param.Add("@Notification_Status", notificationParams.Notification_Status);
            param.Add("@Page", notificationParams.Page);
            param.Add("@Size", notificationParams.Size);

            var result = await Task.FromResult(_dapper.GetDataSet(Query, param, commandType: CommandType.StoredProcedure));
            var dtNotificationResult = result.Tables[0];
            var notificationResults = ConvertDataTableToList<NotificationResult>(dtNotificationResult);
            return notificationResults;
        }

        /// <summary>
        /// Archive notification
        /// </summary>
        /// <param name="notificationId">Notification id to be archived</param>
        /// <param name="isAllSelected">This field indicates that,we selecte all record or not</param>
        /// <param name="IsArchiving">This field indicates that notification is being archived or removed from archive</param>
        /// <param name="Email">Email</param>
        /// <returns></returns>
        public async Task<int> ArchiveNotification (int notificationId,int isAllSelected,int isArchiving,string email)
        {
            int result;
            string sp = "sp_archive_notification";
            DynamicParameters param = new DynamicParameters();
            param.Add("@NotificationId", notificationId);
            param.Add("@Email", email);
            param.Add("@IsAllSelected", isAllSelected);
            param.Add("@IsArchiving", isArchiving);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }

        /// <summary>
        /// Update notification Status and get data by id
        /// </summary>
        /// <param name="notificationId">Notification id to be updated</param>
        /// <param name="Email">Email</param>
        /// <returns></returns>
        public async Task<NotificationResult> GetNotificationByIdAndUpdate(int notificationId, string email)
        {
            string query = "sp_get_notofication_data_by_id";
            DynamicParameters param = new DynamicParameters();
            param.Add("@NotificationId", notificationId);
            param.Add("@Email", email);
            var result = await Task.FromResult(_dapper.GetDataSet(query, param, commandType: CommandType.StoredProcedure));
            var dtNotificationResult = result.Tables.Count > 0 ? result.Tables[0] : null ;
            if(dtNotificationResult==null)
            {
                return null;
            }
            else
            {
                var notificationResult = GetItem<NotificationResult>(dtNotificationResult.Rows[0]);
                return notificationResult;
            }
            
        }
        /// <summary>
        /// Conver table to list
        /// </summary>
        /// <typeparam name="T">Any Type</typeparam>
        /// <param name="dt">Data Table</param>
        /// <returns>List Object</returns>
        private List<T> ConvertDataTableToList<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetItem<T>(row);
                data.Add(item);
            }
            return data;
        }
        /// <summary>
        /// Get Object for each data row
        /// </summary>
        /// <typeparam name="T">Any Type</typeparam>
        /// <param name="dr">Data row</param>
        /// <returns>Object</returns>
        private T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in dr.Table.Columns)
            {
                foreach (PropertyInfo pro in temp.GetProperties())
                {
                    if (pro.Name.ToUpper() == column.ColumnName.ToUpper())
                        pro.SetValue(obj, dr[column.ColumnName], null);
                }
            }
            return obj;
        }

    }
}
