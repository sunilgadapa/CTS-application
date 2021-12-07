using System.IO;

namespace OLDMutual.CTS.Reporting.Domain.Models
{
    public class ExportedFile
    {
        /// <summary>
        /// File stream of exported file
        /// </summary>
        public Stream FileStream { get; set; }
        /// <summary>
        /// File suffix name
        /// </summary>
        public string FileSuffix { get; set; }
    }
}
