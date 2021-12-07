
using System;

namespace OLDMutual.CTS.Reporting.Domain.Models
{
    

    public class EmbedReport
    {
        /// <summary>
        ///  Id of Power BI report to be embedded
        /// </summary>

        public Guid ReportId { get; set; }

        /// <summary>
        /// Name of the report
        /// </summary>
        public string ReportName { get; set; }

        /// <summary>
        /// Embed URL for the Power BI report
        /// </summary>
        public string EmbedUrl { get; set; }
    }
}