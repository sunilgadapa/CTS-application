using Newtonsoft.Json;
using System.Collections.Generic;

namespace OLDMutual.CTS.Reporting.Domain.Models
{

    public class Value
    {
        public string Name { get; set; }
        public string displayName { get; set; }
        public int order { get; set; }
    }

    public class Root
    {
        [JsonProperty("@odata.context")]
        public string OdataContext { get; set; }
        public List<Value> value { get; set; }
    }
}
