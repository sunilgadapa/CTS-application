using OLDMutual.CTS.SnsNotification.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace OLDMutual.CTS.SnsNotification.Data.Interfaces
{
    public interface ISnsNotification : IDisposable
    {
        /// <summary>
        /// Get Notification Count
        /// </summary>
        /// <param name="email"></param>
        /// <returns>Object</returns>
        Task<NotificationCountResult> GetNotificationCount(string email);

        /// <summary>
        /// Get Notification result based on user id and notification Type
        /// </summary>
        /// <param name="notificationParams">Input params for procedure</param>
        /// <returns>LIst Object</returns>
        Task<IEnumerable<NotificationResult>> GetNotificationResult(NotificationParams notificationParams);

        /// <summary>
        /// Archive notification
        /// </summary>
        /// <param name="notificationId">Notification id to be archived</param>
        /// <param name="isAllSelected">This field indicates that,we selecte all record or not</param>
        /// <param name="IsArchiving">This field indicates that notification is being archived or removed from archive</param>
        /// <param name="Email">Email</param>
        /// <returns></returns>
        Task<int> ArchiveNotification(int notificationId, int isAllSelected, int isArchiving, string email);

        /// <summary>
        /// Update notification Status and get data by id
        /// </summary>
        /// <param name="notificationId">Notification id to be updated</param>
        /// <param name="Email">Email</param>
        /// <returns></returns>
        Task<NotificationResult> GetNotificationByIdAndUpdate(int notificationId, string email);
    }
}
