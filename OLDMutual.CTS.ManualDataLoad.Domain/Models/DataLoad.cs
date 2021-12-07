namespace OLDMutual.CTS.ManualDataLoad.Domain.Models
{
    public class DataLoad
    {
        public int? file_id { get; set; }
        public string file_name { get; set; }
        public int file_status_code { get; set; }
        public string file_landed_date { get; set; }
        public string status { get; set; }
        public int document_type_id { get; set; }
        public string taxperiod { get; set; }
        public int[] file_type { get; set; }
        public int[] tax_period { get; set; }
        public string file_type_val { get; set; }
        public int[] status_type { get; set; }
        public int[] Load_Type_val { get; set; }
        public int Load_Type { get; set; }
        public int[] period_val { get; set; }
        public int period { get; set; }
        public string SearchText { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }
        public int totalrows { get; set; }
        public string file_storage_path { get; set; }
        public int ErrorCount { get; set; }
        public string SourceSystemName { get; set; }
        public string RangeStart { get; set; }
        public string RangeEnd { get; set; }
        public int[] SourceSystemIds { get; set; }
        public int TaxPeriodId { get; set; }
        public int TaxModuleId { get; set; }
        public string TaxYears { get; set; }
        public string[] strTaxYears { get; set; }
    }
}
