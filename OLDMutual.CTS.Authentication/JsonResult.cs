using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Identity
{
    public class JsonResult
    {
        public int Statuscode { get; set; }
        public string Message { get; set; }
        public object data { get; set; }
    }
}
