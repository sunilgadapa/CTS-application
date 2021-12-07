
using Microsoft.PowerBI.Api.Models;
using System;

namespace OLDMutual.CTS.Reporting.Domain.Models
{


    public class DashboardEmbedConfig
    {
        /// <summary>
        /// DashboardId
        /// </summary>
        public Guid DashboardId { get; set; }

        /// <summary>
        /// Embed Url
        /// </summary>
        public string EmbedUrl { get; set; }
        /// <summary>
        /// Embed Token
        /// </summary>
        public EmbedToken EmbedToken { get; set; }
    }
}
