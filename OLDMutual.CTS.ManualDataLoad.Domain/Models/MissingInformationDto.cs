using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Models
{
    public class MissingInformationDto
    {
        public int TotalNumerOfRows { get; set; }
        public string MissingLookupTypeName { get; set; }
        public string MissingLookupValueName { get; set; }
        public int RowNumber { get; set; }
    }
}
