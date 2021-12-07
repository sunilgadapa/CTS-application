using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Models
{
    public class LookupMiscData
    {
        public int other_misc_info_id { get; set; }
        public int lookup_value_id { get; set; }
        public string lookup_type { get; set; }
        public string value { get; set; }
        public int contact_id { get; set; }
        public string contact_type { get; set; }
        public string effective_date { get; set; }
        public string expiry_date { get; set; }
        public bool status_flag { get; set; }
        public string SearchText { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }
        public int totalrows { get; set; }
    }
}
