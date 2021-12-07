using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Models
{
    public class NotificationConfigDto
    {
        public string StatusFlag { get; set; }
        public string Roles { get; set; }
        public string UserNames { get; set; }
        public string RoleIds { get; set; }
        public string NotificationConfifIds { get; set; }
        public string NotificationTemplateId { get; set; }
        public int NotificationTypeId { get; set; }
        public string UserId { get; set; }
        public int TaxIds { get; set; }
        public int EventIds { get; set; }
        public string SearchBy { get; set; }
        public int[] ConfigIds { get; set; }
        public int Id { get; set; }
        public int[] Ids { get; set; }
        public string EntityToAdd { get; set; }
        public int[] RoleArray { get; set; }
        public int RoleId { get; set; }
        public int NotificationTempId { get; set; }
        public string[] strUserNames { get; set; }

    }
}
