namespace OLDMutual.CTS.SnsNotification.Domain.Models
{
    public class NotificationResult
    {

        /// <summary>
        /// NotificationId
        /// </summary>
        public int NotificationId { get; set; }

        /// <summary>
        /// Template
        /// </summary>
        public string Template { get; set; }

        /// <summary>
        /// MessageHeader
        /// </summary>
        public string MessageHeader { get; set; }

        /// <summary>
        /// Notification Message
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Status to display on dashboard notification
        /// </summary>
        public string DisplayStatus { get; set; }

        /// <summary>
        /// StatusCode
        /// </summary>
        public int StatusCode { get; set; }

        /// <summary>
        /// MessagingEventId
        /// </summary>
        public int MessagingEventId { get; set; }

        /// <summary>
        /// MessagingEvent
        /// </summary>
        public string MessagingEvent { get; set; }

        /// <summary>
        /// This field indicates when the status got change
        /// </summary>
        public string Duration { get; set; }
        /// <summary>
        /// This field indicate status date
        /// </summary>
        public string StatusDate { get; set; }
        /// <summary>
        /// This field indicate status time
        /// </summary>
        public string StatusTime { get; set; }

        /// <summary>
        /// ProcessName
        /// </summary>
        public string ProcessName { get; set; }
        /// <summary>
        /// TaxModule
        /// </summary>
        public string TaxModule { get; set; }
        /// <summary>
        /// FileName
        /// </summary>
        public string FileName { get; set; }
        /// <summary>
        /// LineOfBusiness
        /// </summary>
        public string LineOfBusiness { get; set; }
        /// <summary>
        /// MessageDate
        /// </summary>
        public string MessageDate { get; set; }

        /// <summary>
        /// IsRead
        /// </summary>
        public bool IsRead { get; set; }

        /// <summary>
        /// IsArchive
        /// </summary>
        public bool IsArchive { get; set; }

    }
}
