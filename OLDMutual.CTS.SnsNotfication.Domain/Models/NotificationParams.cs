namespace OLDMutual.CTS.SnsNotification.Domain.Models
{
    public class NotificationParams
    {
        /// <summary>
        /// Email
        /// </summary>
        public string Email { get; set; }
        /// <summary>
        /// This field indicates what type of notification to be triggered
        /// </summary>
        public string Notification_Type { get; set; }

        /// <summary>
        /// This field indicates notification status (unread and archive)
        /// </summary>
        public int Notification_Status { get; set; }
        /// <summary>
        /// This field indicate page index
        /// </summary>
        public int Page { get; set; }
        /// <summary>
        /// This field indicate page size
        /// </summary>
        public int Size { get; set; }
    }
}
