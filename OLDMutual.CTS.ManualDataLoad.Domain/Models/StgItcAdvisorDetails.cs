using System;
using System.Collections.Generic;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Models
{
    public class StgItcAdvisorDetails
	{
		public int row_id { get; set; }
		public string TaxCertificateType { get; set; }
		public string RecordSubmissionType { get; set; }
		public string TaxYear { get; set; }
		public string SourceSystemID { get; set; }
		public string FundEntityCode { get; set; }
		public string ClientID { get; set; }
		public string PolicyID { get; set; }
		public string ProductCode { get; set; }
		public string ProductInstance { get; set; }  
		public string AdvisorID { get; set; }
		public string ChannelID { get; set; }
		public string NatureofPerson { get; set; }
		public string Name { get; set; }
		public string Initials { get; set; }
		public string Forenames { get; set; }
		public string IDNumber { get; set; }
		public string PassportNumber { get; set; }
		public string PassportCountryofIssue { get; set; }
		public string TaxNumber { get; set; }
		public string RegistrationNumber { get; set; }
		public string DateofBirth { get; set; }
		public string PhysicalAddressUnitNumber { get; set; }
		public string PhysicalAddressComplex { get; set; }
		public string PhysicalAddressStreetNumber { get; set; }
		public string PhysicalAddressStreetName { get; set; }
		public string PhysicalAddressSuburb { get; set; }
		public string PhysicalAddressCity { get; set; }
		public string PhysicalAddressPostCode { get; set; }
		public string PostalsameasResidential { get; set; }
		public string PostalAddressLine1 { get; set; }
		public string PostalAddressLine2 { get; set; }
		public string PostalAddressLine3 { get; set; }
		public string PostalAddressLine4 { get; set; }
		public string PostalAddressPostCode { get; set; }
		public string LicenceNumber { get; set; }
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


	public class ListAdvisorDetailData
    {
		public List<StgItcAdvisorDetails> AdvisorData { get; set; }
    }
}
