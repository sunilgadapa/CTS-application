using System;
using System.Collections.Generic;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Models
{
    public class StgItcIntermediaryData
	{
		public int row_id { get; set; }
		public string MDMID { get; set; }
		public string AdvisorID { get; set; }
		public string AdvisorIDEffectiveDate { get; set; }
		public string AdvisorIDExpiryDate { get; set; }
		public string AdvisorIDStatus { get; set; }
		public string ChannelNo { get; set; }
		public string ChannelDescr { get; set; }
		public string NatureOfPerson { get; set; }
		public string Surname { get; set; }
		public string Initials { get; set; }
		public string FirstNames { get; set; }
		public string IDNumber { get; set; }
		public string IDCountryOfIssue { get; set; }
		public string PassportNumber { get; set; }
		public string PassportCountryOfIssue { get; set; }
		public string TaxNumber { get; set; }
		public string TaxNumberCountryOfIssue { get; set; }
		public string CompanyNumber { get; set; }
		public string CompanyNumberIssueCountry { get; set; }
		public string Birthdate { get; set; }
		public string PhysicalAddressLine1 { get; set; }
		public string PhysicalAddressLine2 { get; set; }
		public string PhysicalAddressLine3 { get; set; }
		public string PhysicalCity { get; set; }
		public string PhysicalPostCode { get; set; }
		public string PhysicalCountry { get; set; }
		public string PostalAddressLine1 { get; set; }
		public string PostalAddressLine2 { get; set; }
		public string PostalAddressLine3 { get; set; }
		public string PostalCity { get; set; }
		public string PostalPostCode { get; set; }
		public string PostalCountry { get; set; }
		public string LicenceNumber { get; set; }
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


	public class ListAdvisorData
    {
		public List<StgItcIntermediaryData> AdvData { get; set; }
    }
}
