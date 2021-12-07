using System;
using System.Collections.Generic;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Models
{
    public class StgItcFinanceDetails
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
		public string ClientIntermediatedIndicator { get; set; }
		public string TaxSourceCode { get; set; }
		public double March { get; set; }
		public double April { get; set; }
		public double May { get; set; }
		public double June { get; set; }
		public double July { get; set; }
		public double August { get; set; }
		public double September { get; set; }
		public double October { get; set; }
		public double November { get; set; }
		public double December { get; set; }
		public double January { get; set; }
		public double February { get; set; }
		public double CurrentAmountIncomeProtectionAmount { get; set; }
		public double ArrearsAmount { get; set; }
		public string ProductName { get; set; }
		public int file_id { get; set; }
		public int status_code { get; set; }
		public int batch_id { get; set; }
		public int job_id { get; set; }
		public bool status_flag { get; set; }
		public string created_by { get; set; }
		public string last_updated_by { get; set; }
		public DateTime created_date { get; set; }
		public DateTime last_updated_date { get; set; }
		public int page { get; set; }
		public int size { get; set; }
		public int File_rowid { get; set; }
		public int totalrows { get; set; }

	}


	public class ListFinanceData
    {
		public List<StgItcFinanceDetails> FinanceData { get; set; }
    }
}
