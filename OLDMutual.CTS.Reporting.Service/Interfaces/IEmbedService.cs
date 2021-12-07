using Microsoft.PowerBI.Api;
using Microsoft.PowerBI.Api.Models;
using OLDMutual.CTS.Reporting.Domain.Models;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Reporting.Service.Interfaces
{
    public interface IEmbedService
    {
        Task<PowerBIClient> GetPowerBiClient();

        /// <summary>
        /// Get embed params for a report
        /// </summary>
        /// <returns>Wrapper object containing Embed token, Embed URL, Report Id, and Report name for single report</returns>
        Task<ReportEmbedConfig> GetEmbedParams(Guid workspaceId, Guid reportId, [Optional] Guid additionalDatasetId);

        /// <summary>
        /// Get embed params for multiple reports for a single workspace
        /// </summary>
        /// <returns>Wrapper object containing Embed token, Embed URL, Report Id, and Report name for multiple reports</returns>
        Task<ReportEmbedConfig> GetEmbedParams(Guid workspaceId, IList<Guid> reportIds, [Optional] IList<Guid> additionalDatasetIds);

        /// <summary>
        /// Get Embed token for single report, multiple datasets, and an optional target workspace
        /// </summary>
        /// <returns>Embed token</returns>
        Task<EmbedToken> GetEmbedToken(Guid reportId, IList<Guid> datasetIds, [Optional] Guid targetWorkspaceId);

        /// <summary>
        /// Get Embed token for multiple reports, datasets, and an optional target workspace
        /// </summary>
        /// <returns>Embed token</returns>
        Task<EmbedToken> GetEmbedToken(IList<Guid> reportIds, IList<Guid> datasetIds, [Optional] Guid targetWorkspaceId);

        /// <summary>
        /// Get Embed token for multiple reports, datasets, and optional target workspaces
        /// </summary>
        /// <returns>Embed token</returns>
        Task<EmbedToken> GetEmbedToken(IList<Guid> reportIds, IList<Guid> datasetIds, [Optional] IList<Guid> targetWorkspaceIds);

        /// <summary>
        /// Get embed params for a dashboard
        /// </summary>
        /// <returns>Wrapper object containing Embed token, Embed URL for single dashboard</returns>
        Task<DashboardEmbedConfig> EmbedDashboard(Guid workspaceId);

        /// <summary>
        /// Get embed params for a tile
        /// </summary>
        /// <returns>Wrapper object containing Embed token, Embed URL for single tile</returns>
        Task<TileEmbedConfig> EmbedTile(Guid workspaceId);

        /// <summary>
        /// Export Power Bi Report
        /// </summary>
        /// <param name="reportId">reportId</param>
        /// <param name="groupId">groupId</param>
        /// <param name="format">format</param>
        /// <param name="pollingtimeOutInMinutes">pollingtimeOutInMinutes</param>
        /// <param name="token">cancellation token</param>
        /// <param name="authToken">authToken</param>
        /// <param name="urlFilter">urlFilter</param>
        /// <returns>Export Object</returns>
        Task<ExportedFile> ExportPowerBIReport(
          Guid reportId,
          Guid groupId,
          FileFormat format,
          int pollingtimeOutInMinutes,
          CancellationToken token,
          string authToken,
          string urlFilter = null);
    }
}
