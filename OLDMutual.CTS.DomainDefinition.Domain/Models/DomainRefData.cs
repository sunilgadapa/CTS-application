using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.DomainDefinition.Domain.Models
{
    public class DomainRefData
    {
        public int? lookup_type_id { get; set; }
        public int? lookup_value_id { get; set; }
        public string lookup_value_alias { get; set; }
        public string lookup_value_name { get; set; }
        public int[] tax_module_id { get; set; }
        public string lookup_value_description { get; set; }
        public string SARS_mapping_code { get; set; }
        public string tax_module_name { get; set; }
        public string[] tax_module_names { get; set; }
        public string tax_module_ids { get; set; }
        public bool status_flag { get; set; }
        public int totalrows { get; set; }
        public int totalselectedrows { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }
        public string searchtext { get; set; }
    }
}
