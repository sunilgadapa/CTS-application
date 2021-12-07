namespace OLDMutual.CTS.DataSubmission.Domain.Models
{
	public class CorrespondenceData
	{
		public int tax_period_id { get; set; }
		public string tax_period_description { get; set; }
		public int tax_type_id { get; set; }
		public string tax_type_description { get; set; }
		public int tax_year { get; set; }
		public int brand_id { get; set; }
		public string brand_description { get; set; }
		public string correspondence_type_id { get; set; }
		public string correspondence_type_description { get; set; }
		public string file_name { get; set; }
		public string correspondance_environment_id { get; set; }
		public string correspondance_environment_name { get; set; }
		public string status_date { get; set; }
		public string updated_by { get; set; }
		public int status_code { get; set; }
		public string status_description { get; set; }

		public int[] brand { get; set; }
		public int[] status_type { get; set; }
		public string[] correspondence_type { get; set; }
		public string[] environment { get; set; }
		public int Page { get; set; }
		public int Size { get; set; }
		public string searchtext { get; set; }
		public int totalrows { get; set; }
		
	}
}
