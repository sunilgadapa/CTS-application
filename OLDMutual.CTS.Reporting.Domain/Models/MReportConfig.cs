namespace OLDMutual.CTS.Reporting.Domain.Models
{
    public class MReportConfig
    {
        public int report_config_id { get; set; }
        public int report_id { get; set; }
        public string database_name { get; set; }
        public string environment { get; set; }
        public string power_bi_report_id { get; set; }
        public string power_bi_group_id { get; set; }
        public string power_bi_dataset_id { get; set; }
        public string report_url { get; set; }
        public string report_storage_type { get; set; }
        public int status_flag { get; set; }
        public string created_by { get; set; }
        public string last_updated_by { get; set; }
        public string created_date { get; set; }
        public string last_updated_date { get; set; }
    }
}
