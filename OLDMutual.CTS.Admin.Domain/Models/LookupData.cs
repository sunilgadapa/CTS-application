using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Models
{
    public class LookupData
    {
        public int? lookup_value_id { get; set; }
        public int lookup_type_id { get; set; }
        public string lookup_value_name { get; set; }
        public string lookup_type_name { get; set; }
        public string lookup_value_description { get; set; }
        public bool status_flag { get; set; }
        public int totalrows { get; set; }
        public int totalselectedrows { get; set; }
        public string misc_value { get; set; }
    }
}
