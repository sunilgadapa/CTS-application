namespace OLDMutual.CTS.Reporting.Domain.Models
{
    // A view model class to pass the data needed to embed a single report.
    public class EmbeddedReportViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string EmbedUrl { get; set; }
        public string Token { get; set; }
    }
}
