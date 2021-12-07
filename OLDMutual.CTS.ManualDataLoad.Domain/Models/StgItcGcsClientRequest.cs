using System;
using System.Collections.Generic;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Models
{
    public class StgItcGcsClientRequest
    {
        public int row_id { get; set; }
        public string SourceSystemID { get; set; }
        public Int64 GCSClientRequestID { get; set; }
        public Int64 ModuleID { get; set; }
        public Int64 SubmissionPeriodID { get; set; }
        public Int64 TaxableEntityID { get; set; }
        public Int64 FundEntityID { get; set; }
        public Int64 TaxSourceCodeID { get; set; }
        public Int64 ReportingFinancialInstitutionID { get; set; }
        public string ClientNumber { get; set; }
        public string ClientNumberRequestType { get; set; }
        public string ExternalSystemID { get; set; }
        public string RequestSystem { get; set; }
        public bool ClientName { get; set; }
        public bool ClientDetails { get; set; }
        public bool ClientServerAgent { get; set; }
        public bool ClientWHT { get; set; }
        public bool ClientColMex { get; set; }
        public string Filler { get; set; }
        public bool ClientPostalAddress { get; set; }
        public bool ClientResidentialAddress { get; set; }
        public bool ClientHomeNumber { get; set; }
        public bool ClientHomeFaxNumber { get; set; }
        public bool ClientHomeEmailAddress { get; set; }
        public bool ClientWorkTelephoneNumber { get; set; }
        public bool ClientWorkFaxNumber { get; set; }
        public bool ClientWorkEmailAddress { get; set; }
        public bool ClientHomeCellNumber { get; set; }
        public bool ClientWorkCellNumber { get; set; }
        public bool ClientAlternateAddress { get; set; }
        public bool Request { get; set; }
        public DateTime? RequestDate { get; set; }
        public bool Requested { get; set; }
        public DateTime? RequestedDate { get; set; }
        public int Received { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public bool NotFound { get; set; }
        public DateTime? NotFoundDate { get; set; }
        public string EXTPARTYREF { get; set; }
        public Int64 WorkflowInstructionID { get; set; }
        public bool FatcaInd { get; set; }
        public Int64 FileImportHistoryID { get; set; }
        public Int64 RequestGUID { get; set; }
        public string StartDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CallBackAddress { get; set; }
        public int GCSRequestAttempts { get; set; }
        public int RemainingRequestAttempts { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string DeletedBy { get; set; }
        public string EndDate { get; set; }
        public int file_id { get; set; }
        public int status_code { get; set; }
        public int batch_id { get; set; }
        public int job_id { get; set; }
        public bool status_flag { get; set; }
        public DateTime created_date { get; set; }
        public DateTime last_updated_date { get; set; }

    }
    public class ListGcsData
    {
        public List<StgItcGcsClientRequest> Gdata { get; set; }
    }
}
