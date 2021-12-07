using System.Collections.Generic;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Models
{
    public class ValidationErrorDto
    {
        public List<DataLoadErrorCol> lstDataLoadErrorHeader{ get; set; }
        public List<DataLoadErrorCol> lstDataLoadErrorDecription { get; set; }
    }
}
