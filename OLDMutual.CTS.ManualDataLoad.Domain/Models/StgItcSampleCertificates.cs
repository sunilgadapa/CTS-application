using System;
using System.Collections.Generic;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Models
{
    public class StgItcSampleCertificates
	{
		public int row_id { get; set; }
		public string TaxYear { get; set; }
		public string SourceSystemID { get; set; }
		public string Brand { get; set; }
		public string ClientID { get; set; }
		public int file_id { get; set; }
		public int status_code { get; set; }
		public int batch_id { get; set; }
		public int job_id { get; set; }
		public bool status_flag { get; set; }
		public DateTime created_date { get; set; }
		public DateTime last_updated_date { get; set; }
		public int page { get; set; }
		public int size { get; set; }
		public int totalrows { get; set; }
	}


	public class ListSampleCerData
    {
		public List<StgItcSampleCertificates> CerData { get; set; }
    }
}
