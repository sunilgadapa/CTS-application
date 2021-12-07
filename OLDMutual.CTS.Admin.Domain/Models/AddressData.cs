using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Models
{
    public class AddressData
    {
        public int address_id { get; set; }
        public int address_type_id { get; set; }
        public string address_line1 { get; set; }
        public string address_line2 { get; set; }
        public string address_line3 { get; set; }
        public int? unit_number { get; set; }       
        public int? postal_code { get; set; }                              
        public int contact_type_id { get; set; }       
        public string city { get; set; }
        public string country { get; set; }
        public int? street_number { get; set; }
        public string suburb { get; set; }
        public string province { get; set; }
        public bool status_flag { get; set; }
        public string effective_date { get; set; }
        public string expiry_date { get; set; }
        public string address_type_alias { get; set; }
    }
}
