using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.DomainDefinition.Domain.Models
{
    public class SaveLookup
    {
        public int[] Ids { get; set; }
        public string lookup_type_name { get; set; }
        public int page { get; set; }
        public int size { get; set; }
        public int totalselectedrows { get; set; }
    }
}
