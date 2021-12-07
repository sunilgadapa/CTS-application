using System;
using System.Collections.Generic;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Models
{
    public class StgItcMembershipDetails
	{
		public int row_id { get; set; }
		public string TaxType { get; set; }
		public string RecordSubmissionType { get; set; }
		public string TaxYear { get; set; }
		public string SourceSystemID { get; set; }
		public string FundEntityCode { get; set; }
		public string ClientID { get; set; }
		public string PolicyID { get; set; }
		public string ProductCode { get; set; }
		public string ProductInstance { get; set; }
		public string PolicyOnDate { get; set; }
		public string PolicyOffDate { get; set; }
		public int file_id { get; set; }
		public int status_code { get; set; }
		public int batch_id { get; set; }
		public int job_id { get; set; }
		public bool status_flag { get; set; }
		public string created_by { get; set; }
		public string last_updated_by { get; set; }
		public DateTime created_date { get; set; }
		public DateTime last_updated_date { get; set; }
		public int File_rowid { get; set; }
		public int page { get; set; }
		public int size { get; set; }		
		public int totalrows { get; set; }

	}


	public class ListMemberData
    {
		public List<StgItcMembershipDetails> MemberData { get; set; }
    }
}
