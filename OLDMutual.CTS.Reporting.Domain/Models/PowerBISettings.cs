namespace OLDMutual.CTS.Reporting.Domain.Models
{
    public class PowerBISettings
    {
        public string AuthenticationType { get; set; }
        public string ApplicationId { get; set; }
        public string WorkspaceId { get; set; }
        public string ReportId { get; set; }
        public string AuthorityUrl { get; set; }
        public string Scope { get; set; }
        public string UrlPowerBiServiceApiRoot { get; set; }
        public string powerBIBaseUrl { get; set; }
        public string EmbedUrlBase { get; set; }
        public string PbiUsername { get; set; }
        public string PbiPassword { get; set; }
        public string ApplicationSecret { get; set; }
        public string Tenant { get; set; }
        public string Environment { get; set; }
        
    }
}
