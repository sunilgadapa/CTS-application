using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Models
{
    public class SaveMessagEvent
    {
        public int[] Ids { get; set; }
        public int tax_module_id { get; set; }
        public int page { get; set; }
        public int size { get; set; }
    }
}
