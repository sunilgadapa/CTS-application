namespace OLDMutual.CTS.Reporting.Domain.Models
{
    class TReportUserHistory
    {
        public string report_user_history_id { get; set; }
        public string report_id { get; set; }
        public string user_id { get; set; }
        public string report_modified_date { get; set; }
        public string environment { get; set; }
        public int report_status { get; set; }
        public string report_parameters { get; set; }
        public string status_flag { get; set; }
        public string created_by { get; set; }
        public int last_updated_by { get; set; }
        public string created_date { get; set; }
        public string last_updated_date { get; set; }
    }
}
