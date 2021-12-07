using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Models
{
    public class MessageEvents
    {
        public int messaging_event_id { get; set; }
        public string messaging_event { get; set; }
        public string message_event_type { get; set; }
        public string messaging_event_description { get; set; }
        public int tax_module_id { get; set; }
        public bool status_flag { get; set; }
        public int totalrows { get; set; }
        public int? Page { get; set; }
        public int Size { get; set; }
        public string searchtext { get; set; }
        public int tax_id { get; set; }
    }
}
