using System.Collections.Generic;

namespace OLDMutual.CTS.DataSubmission.Domain.Models
{
    public class ViewError
    {
        public List<SarsSubmissionData> sarsSubmissionData { get; set; }
        public List<DataLoadErrorCol> sarsSubmissionErrorHeaderData { get; set; }
        public List<SarsSubmissionErrorData> sarsSubmissionErrorData { get; set; }
    }
}
