
using Microsoft.PowerBI.Api.Models;
using System.Collections.Generic;


namespace OLDMutual.CTS.Reporting.Domain.Models
{
    
    public class ReportEmbedConfig
    {
        // Report to be embedded
        public List<EmbedReport> EmbedReports { get; set; }

        // Embed Token for the Power BI report
        public EmbedToken EmbedToken { get; set; }
    }
}