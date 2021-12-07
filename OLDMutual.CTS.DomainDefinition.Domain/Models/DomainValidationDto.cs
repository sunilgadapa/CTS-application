using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.DomainDefinition.Domain.Models
{
    public class DomainValidationDto
    {
        public string Pattern { get; set; }
        public string PatternDescription { get; set; }
        public int? PatternId { get; set; }
        public string PatternType { get; set; }
        public int? MinLength { get; set; }
        public int? MaxLength { get; set; }
        public int LookupValueId { get; set; }
        public int? LookupTypeId { get; set; }
        public string LookupType { get; set; }
        public string LookupValueName { get; set; }
    }
}
