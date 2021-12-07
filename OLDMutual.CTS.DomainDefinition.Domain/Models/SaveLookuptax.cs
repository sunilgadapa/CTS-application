using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.DomainDefinition.Domain.Models
{
    public class SaveLookuptax
    {
        public int Ids { get; set; }
        public int lookup_type_id { get; set; }
        public int page { get; set; }
        public int size { get; set; }
    }
}
