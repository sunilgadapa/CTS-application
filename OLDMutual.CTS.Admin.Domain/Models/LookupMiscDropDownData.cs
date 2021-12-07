using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Models
{
    public class LookupMiscDropDownData
    {
        public int lookup_type_id { get; set; }
        public string lookup_value_name { get; set; }
        public int lookup_value_id { get; set; }
        public string lookup_value_alias { get; set; }
    }
}
