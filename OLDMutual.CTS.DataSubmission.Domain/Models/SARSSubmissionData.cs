namespace OLDMutual.CTS.DataSubmission.Domain.Models
{
    public class SarsSubmissionData
    {
        public int? sars_submission_id { get; set; }
        public int tax_period_id { get; set; }
        public string tax_period_name { get; set; }
        public int fund_entity_id { get; set; }
        public string fund_entity_name { get; set; }
        public int file_region_id { get; set; }
        public string file_region_name { get; set; }
        public int status_id { get; set; }
        public string status_name { get; set; }
        public int status_code { get; set; }
        public string tax_number { get; set; }
        public string file_name { get; set; }
        public string status_date { get; set; }
        public bool status_flag { get; set; }
        public string last_updated_date { get; set; }
        public int[] fileregion_type { get; set; }
        public int[] status_type { get; set; }
        public int[] fundentity_type { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }
        public string searchtext { get; set; }
        public int totalrows { get; set; }
        public int ErrorCount { get; set; }
        public string tax_type_id { get; set; }
    }
}
