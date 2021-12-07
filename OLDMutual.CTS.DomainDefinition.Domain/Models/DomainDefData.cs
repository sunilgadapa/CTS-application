using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.DomainDefinition.Domain.Models
{
    public class DomainDefData
    {
        public int? lookup_type_id { get; set; }
        public string lookup_type { get; set; }
        public string lookup_name { get; set; }
        public string lookup_value_alias { get; set; }
        public string lookup_type_description { get; set; }
        public bool submission_domain_flag { get; set; }
        public bool validation_flag { get; set; }
        public bool status_flag { get; set; }
        public int totalrows { get; set; }
        public int totalselectedrows { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }
        public string searchtext { get; set; }    
    }
}
