using OLDMutual.CTS.SnsNotification.Domain.Models;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace OLDMutual.CTS.SnsNotification.Service.Interfaces
{
    public interface ISnsNotificationService
    {
        /// <summary>
        /// Get Notification Count
        /// </summary>
        /// <returns>Object</returns>
        Task<NotificationCountResult> GetNotificationCount();

        /// <summary>
        /// Get Notification result based on user id and notification Type
        /// </summary>
        /// <param name="notificationParams">Input params for procedure</param>
        /// <returns>LIst Object</returns>
        Task<IEnumerable<NotificationResult>> GetNotificationResult(NotificationParams notificationParams);

        /// <summary>
        /// Publishes email to an Amazon SNS topic.
        /// </summary>

        Task<bool> PublishToTopicForEmailAsync();

        /// <summary>
        /// Archive notification
        /// </summary>
        /// <param name="notificationId">Notification id to be archived</param>
        /// <param name="isAllSelected">This field indicates that,we selecte all record or not</param>
        /// <param name="IsArchiving">This field indicates that notification is being archived or removed from archive</param>
        /// <returns>integer value</returns>
        Task<int> ArchiveNotification(int notificationId, int isAllSelected, int isArchiving);

        /// <summary>
        /// Update notification Status and get data by id
        /// </summary>
        /// <param name="notificationId">Notification id to be updated</param>
        /// <returns></returns>
        Task<NotificationResult> GetNotificationByIdAndUpdate(int notificationId);
    }
}
