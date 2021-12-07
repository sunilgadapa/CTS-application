using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Models
{
    public class TaxPeriodDto
    {
        public int TaxPeriodId { get; set; }
        public int[] TaxPeriodIds { get; set; }
        public bool StatusFlag { get; set; }
        public string TaxTypeName { get; set; }
        public int TaxTypeId { get; set; }
        public string TaxPeriodTypeName { get; set; }
        public int TaxPeriodTypeId { get; set; }
        public int TaxYear { get; set; }
        public string TaxPeriodDescription { get; set; }
        public string SubmissionStartDate { get; set; }
        public string SubmissionEndDate { get; set; }
        public string LandingStartDate { get; set; }
        public string LandingEndDate { get; set; }
        public int TotalRows { get; set; }
        public int PageNumber { get; set; }
        public int Size { get; set; }
        public int FileId { get; set; }
    }
}
