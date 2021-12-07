using System.Collections.Generic;

namespace OLDMutual.CTS.Correspondence.Domain.Models
{
    public class ViewError
    {
        public CorrespondenceData CorrespondenceData { get; set; }
        public List<DataLoadErrorCol> CorrespondenceErrorHeaderData { get; set; }
        public List<CorrespondenceErrorData> CorrespondenceErrorData { get; set; }
    }
}
