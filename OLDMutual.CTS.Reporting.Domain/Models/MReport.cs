namespace OLDMutual.CTS.Reporting.Domain.Models
{
    public class MReport
    {
        /// <summary>
        /// report id
        /// </summary>
        public int report_id { get; set; }
        /// <summary>
        /// report name
        /// </summary>
        public string report_name { get; set; }
        /// <summary>
        /// report description
        /// </summary>
        public string report_description { get; set; }
        /// <summary>
        /// status
        /// </summary>
        public int status_flag { get; set; }

        /// <summary>
        /// created by
        /// </summary>
        public string created_by { get; set; }

        /// <summary>
        /// last updated by
        /// </summary>
        public string last_updated_by { get; set; }

        /// <summary>
        /// created date
        /// </summary>

        public string created_date { get; set; }

        /// <summary>
        /// last updated date
        /// </summary>
        public string last_updated_date { get; set; }

    }
}
