using System;
using System.Collections.Generic;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Models
{
	public class StgItcClientDetailData
	{
		public int row_id { get; set; }
		public string TaxType { get; set; }
		public string RecordSubmissionType { get; set; }
		public int TaxYear { get; set; }
		public string SourceSystemID { get; set; }
		public string FundEntityCode { get; set; }
		public string ClientID { get; set; }
		public string NatureOfPerson { get; set; }
		public string Name { get; set; }
		public string Initials { get; set; }
		public string Forenames { get; set; }
		public string IDNumber { get; set; }
		public string PassportNumber { get; set; }
		public string PassportCountryOfIssue { get; set; }
		public string TaxNumber { get; set; }
		public string RegistrationNumber { get; set; }
		public string DateOfBirth { get; set; }
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
		public string FICAStatus { get; set; }
		public string SAResidenceInd { get; set; }
		public string TradingName { get; set; }
		public string DateOfDeath { get; set; }
		public string Language { get; set; }
		public string CertificateMailingPreference { get; set; }
		public string Email_Address { get; set; }
		public string Title { get; set; }
		public string CellphoneNumber { get; set; }
		public string DateLastUpdated { get; set; }
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
		public int totalrows { get; set; }

	}

	public class ListClientDetailThirdParty
	{
		public List<StgItcClientDetailData> CError { get; set; }
	}
}
