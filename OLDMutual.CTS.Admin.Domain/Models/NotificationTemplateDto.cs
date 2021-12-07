using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Models
{
    public class NotificationTemplateDto
    {
        public int NotificationTypeId { get; set; }
        public int EventId { get; set; }
        public string NotificationTemplate { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string UserName { get; set; }
        public int OldTemplateId { get; set; }
        public int NotificationTemplateId { get; set; }
        public bool Status { get; set; }
    }
}
