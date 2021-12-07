
using Microsoft.PowerBI.Api.Models;
using System;

namespace OLDMutual.CTS.Reporting.Domain.Models
{

    public class TileEmbedConfig
    {
        /// <summary>
        /// Tile Id
        /// </summary>
        public Guid TileId { get; set; }
        /// <summary>
        /// Embed Url
        /// </summary>
        public string EmbedUrl { get; set; }
        /// <summary>
        /// Embed Token
        /// </summary>
        public EmbedToken EmbedToken { get; set; }
        /// <summary>
        /// Dashboard Id
        /// </summary>
        public Guid DashboardId { get; set; }
    }
}