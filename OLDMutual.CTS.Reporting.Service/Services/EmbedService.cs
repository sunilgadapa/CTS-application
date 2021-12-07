using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.PowerBI.Api;
using Microsoft.PowerBI.Api.Models;
using Microsoft.Rest;
using Newtonsoft.Json;
using OLDMutual.CTS.Reporting.Domain.Models;
using OLDMutual.CTS.Reporting.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Reporting.Service.Services
{

    public class EmbedService : IEmbedService
    {
        private readonly string urlPowerBiServiceApiRoot;
        private readonly IAadService _aadService;
        private readonly PowerBISettings _powerBISettings;
        public EmbedService(IOptions<PowerBISettings> powerBISettings, IAadService aadService)
        {
            _powerBISettings = powerBISettings.Value;
            urlPowerBiServiceApiRoot = _powerBISettings.UrlPowerBiServiceApiRoot;
            _aadService = aadService;
        }

        public IConfiguration Configuration { get; }
        public async Task<PowerBIClient> GetPowerBiClient()
        {
            var tokenCredentials = new TokenCredentials(await _aadService.GetAccessToken(), "Bearer");
            return new PowerBIClient(new Uri(urlPowerBiServiceApiRoot), tokenCredentials);
        }

        /// <summary>
        /// Get embed params for a report
        /// </summary>
        /// <returns>Wrapper object containing Embed token, Embed URL, Report Id, and Report name for single report</returns>
        public async Task<ReportEmbedConfig> GetEmbedParams(Guid workspaceId, Guid reportId, [Optional] Guid additionalDatasetId)
        {
            using (var pbiClient = await GetPowerBiClient())
            {
                // Get report info
                var pbiReport = pbiClient.Reports.GetReportInGroup(workspaceId, reportId);

                // Create list of dataset
                var datasetIds = new List<Guid>();

                // Add dataset associated to the report
                datasetIds.Add(Guid.Parse(pbiReport.DatasetId));

                // Append additional dataset to the list to achieve dynamic binding later
                if (additionalDatasetId != Guid.Empty)
                {
                    datasetIds.Add(additionalDatasetId);
                }

                // Add report data for embedding
                var embedReports = new List<EmbedReport>() {
                    new EmbedReport
                    {
                        ReportId = pbiReport.Id, ReportName = pbiReport.Name, EmbedUrl = pbiReport.EmbedUrl
                    }
                };

                // Get Embed token multiple resources
                var embedToken = await GetEmbedToken(reportId, datasetIds, workspaceId);

                // Capture embed params
                var embedParams = new ReportEmbedConfig
                {
                    EmbedReports = embedReports,
                    EmbedToken = embedToken
                };

                return embedParams;
            }
        }

        /// <summary>
        /// Get embed params for multiple reports for a single workspace
        /// </summary>
        /// <returns>Wrapper object containing Embed token, Embed URL, Report Id, and Report name for multiple reports</returns>
        public async Task<ReportEmbedConfig> GetEmbedParams(Guid workspaceId, IList<Guid> reportIds, [Optional] IList<Guid> additionalDatasetIds)
        {
            // Note: This method is an example and is not consumed in this sample app

            using (var pbiClient = await GetPowerBiClient())
            {
                // Create mapping for reports and Embed URLs
                var embedReports = new List<EmbedReport>();

                // Create list of datasets
                var datasetIds = new List<Guid>();

                // Get datasets and Embed URLs for all the reports
                foreach (var reportId in reportIds)
                {
                    // Get report info
                    var pbiReport = pbiClient.Reports.GetReportInGroup(workspaceId, reportId);

                    // Append to existing list of datasets to achieve dynamic binding later
                    datasetIds.Add(Guid.Parse(pbiReport.DatasetId));

                    // Add report data for embedding
                    embedReports.Add(new EmbedReport { ReportId = pbiReport.Id, ReportName = pbiReport.Name, EmbedUrl = pbiReport.EmbedUrl });
                }

                // Append to existing list of datasets to achieve dynamic binding later
                if (additionalDatasetIds != null)
                {
                    datasetIds.AddRange(additionalDatasetIds);
                }

                // Get Embed token multiple resources
                var embedToken = await GetEmbedToken(reportIds, datasetIds, workspaceId);

                // Capture embed params
                var embedParams = new ReportEmbedConfig
                {
                    EmbedReports = embedReports,
                    EmbedToken = embedToken
                };

                return embedParams;
            }
        }

        /// <summary>
        /// Get Embed token for single report, multiple datasets, and an optional target workspace
        /// </summary>
        /// <returns>Embed token</returns>
        public async Task<EmbedToken> GetEmbedToken(Guid reportId, IList<Guid> datasetIds, [Optional] Guid targetWorkspaceId)
        {
            using (var pbiClient = await GetPowerBiClient())
            {
                // Create a request for getting Embed token 
                // This method works only with new Power BI V2 workspace experience
                var tokenRequest = new GenerateTokenRequestV2(

                reports: new List<GenerateTokenRequestV2Report>() { new GenerateTokenRequestV2Report(reportId) },

                datasets: datasetIds.Select(datasetId => new GenerateTokenRequestV2Dataset(datasetId.ToString())).ToList(),

                targetWorkspaces: targetWorkspaceId != Guid.Empty ? new List<GenerateTokenRequestV2TargetWorkspace>() { new GenerateTokenRequestV2TargetWorkspace(targetWorkspaceId) } : null
                );

                // Generate Embed token
                var embedToken = pbiClient.EmbedToken.GenerateToken(tokenRequest);

                return embedToken;
            }
        }

        /// <summary>
        /// Get Embed token for multiple reports, datasets, and an optional target workspace
        /// </summary>
        /// <returns>Embed token</returns>
        public async Task<EmbedToken> GetEmbedToken(IList<Guid> reportIds, IList<Guid> datasetIds, [Optional] Guid targetWorkspaceId)
        {
            // Note: This method is an example and is not consumed in this sample app

            using (var pbiClient = await GetPowerBiClient())
            {
                // Convert reports to required types
                var reports = reportIds.Select(reportId => new GenerateTokenRequestV2Report(reportId)).ToList();

                // Convert datasets to required types
                var datasets = datasetIds.Select(datasetId => new GenerateTokenRequestV2Dataset(datasetId.ToString())).ToList();

                // Create a request for getting Embed token 
                // This method works only with new Power BI V2 workspace experience
                var tokenRequest = new GenerateTokenRequestV2(

                    datasets: datasets,

                    reports: reports,

                    targetWorkspaces: targetWorkspaceId != Guid.Empty ? new List<GenerateTokenRequestV2TargetWorkspace>() { new GenerateTokenRequestV2TargetWorkspace(targetWorkspaceId) } : null
                );

                // Generate Embed token
                var embedToken = pbiClient.EmbedToken.GenerateToken(tokenRequest);

                return embedToken;
            }
        }

        /// <summary>
        /// Get Embed token for multiple reports, datasets, and optional target workspaces
        /// </summary>
        /// <returns>Embed token</returns>
        public async Task<EmbedToken> GetEmbedToken(IList<Guid> reportIds, IList<Guid> datasetIds, [Optional] IList<Guid> targetWorkspaceIds)
        {
            // Note: This method is an example and is not consumed in this sample app
            using (var pbiClient = await GetPowerBiClient())
            {
                // Convert report Ids to required types
                var reports = reportIds.Select(reportId => new GenerateTokenRequestV2Report(reportId)).ToList();

                // Convert dataset Ids to required types
                var datasets = datasetIds.Select(datasetId => new GenerateTokenRequestV2Dataset(datasetId.ToString())).ToList();

                // Convert target workspace Ids to required types
                IList<GenerateTokenRequestV2TargetWorkspace> targetWorkspaces = null;
                if (targetWorkspaceIds != null)
                {
                    targetWorkspaces = targetWorkspaceIds.Select(targetWorkspaceId => new GenerateTokenRequestV2TargetWorkspace(targetWorkspaceId)).ToList();
                }

                // Create a request for getting Embed token 
                // This method works only with new Power BI V2 workspace experience
                var tokenRequest = new GenerateTokenRequestV2(

                    datasets: datasets,

                    reports: reports,

                    targetWorkspaces: targetWorkspaceIds != null ? targetWorkspaces : null
                );

                // Generate Embed token
                var embedToken = pbiClient.EmbedToken.GenerateToken(tokenRequest);

                return embedToken;
            }


        }

        /// <summary>
        /// Get embed params for a dashboard
        /// </summary>
        /// <returns>Wrapper object containing Embed token, Embed URL for single dashboard</returns>
        public async Task<DashboardEmbedConfig> EmbedDashboard(Guid workspaceId)
        {
            // Create a Power BI Client object. It will be used to call Power BI APIs.
            using (var client = await GetPowerBiClient())
            {
                // Get a list of dashboards.
                var dashboards = await client.Dashboards.GetDashboardsInGroupAsync(workspaceId);

                // Get the first report in the workspace.
                var dashboard = dashboards.Value.FirstOrDefault();

                // Generate Embed Token.
                var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
                var tokenResponse = await client.Dashboards.GenerateTokenInGroupAsync(workspaceId, dashboard.Id, generateTokenRequestParameters);

                // Generate Embed Configuration.
                var dashboardEmbedConfig = new DashboardEmbedConfig
                {
                    EmbedToken = tokenResponse,
                    EmbedUrl = dashboard.EmbedUrl,
                    DashboardId = dashboard.Id
                };

                return dashboardEmbedConfig;
            }

        }

        /// <summary>
        /// Get embed params for a tile
        /// </summary>
        /// <returns>Wrapper object containing Embed token, Embed URL for single tile</returns>
        public async Task<TileEmbedConfig> EmbedTile(Guid workspaceId)
        {

            // Create a Power BI Client object. It will be used to call Power BI APIs.
            using (var client = await GetPowerBiClient())
            {
                // Get a list of dashboards.
                var dashboards = await client.Dashboards.GetDashboardsInGroupAsync(workspaceId);

                // Get the first report in the workspace.
                var dashboard = dashboards.Value.FirstOrDefault();

                var tiles = await client.Dashboards.GetTilesInGroupAsync(workspaceId, dashboard.Id);

                // Get the first tile in the workspace.
                var tile = tiles.Value.FirstOrDefault();

                // Generate Embed Token for a tile.
                var generateTokenRequestParameters = new GenerateTokenRequest(accessLevel: "view");
                var tokenResponse = await client.Tiles.GenerateTokenInGroupAsync(workspaceId, dashboard.Id, tile.Id, generateTokenRequestParameters);

                // Generate Embed Configuration.
                var tileEmbedConfig = new TileEmbedConfig()
                {
                    EmbedToken = tokenResponse,
                    EmbedUrl = tile.EmbedUrl,
                    TileId = tile.Id,
                    DashboardId = dashboard.Id
                };

                return tileEmbedConfig;
            }

        }

        /// <summary>
        /// PostExportRequest
        /// </summary>
        /// <param name="reportId"></param>
        /// <param name="groupId"></param>
        /// <param name="format"></param>
        /// <param name="authToken"></param>
        /// <param name="urlFilter"></param>
        /// <returns></returns>
        private async Task<string> PostExportRequest(Guid reportId, Guid groupId, FileFormat format, string authToken, string urlFilter = null)
        {
            var exportId = "";
            Root pageNames = new Root();
            using (var client = new HttpClient())
            {
                var baseUrl = _powerBISettings.UrlPowerBiServiceApiRoot;
                client.BaseAddress = new Uri(baseUrl);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
                //GET Method
                var method = "v1.0/myorg/reports/{reportId}/pages";
                method = method.Replace("{reportId}", reportId.ToString());
                HttpResponseMessage response = await client.GetAsync(method);
                if (response.IsSuccessStatusCode)
                {
                    var result = response.Content.ReadAsStringAsync();
                    pageNames = JsonConvert.DeserializeObject<Root>(result.Result);

                }
            }
            var powerBIReportExportConfiguration = new PowerBIReportExportConfiguration
            {
                Settings = new ExportReportSettings
                {
                    Locale = "en-us",
                },
                // Note that page names differ from the page display names
                // To get the page names use the GetPages REST API
                Pages = pageNames?.value?.Select(pn => new ExportReportPage(pageName: pn.Name)).ToList(),
                // ReportLevelFilters collection needs to be instantiated explicitly
                ReportLevelFilters = !string.IsNullOrEmpty(urlFilter) ? new List<ExportFilter>() { new ExportFilter(urlFilter) } : null,

            };

            var exportRequest = new ExportReportRequest
            {
                Format = format,
                PowerBIReportConfiguration = powerBIReportExportConfiguration,
            };

            // The 'Client' object is an instance of the Power BI .NET SDK
            using (var client = await GetPowerBiClient())
            {
                var export = await client.Reports.ExportToFileInGroupAsync(groupId, reportId, exportRequest);
                exportId = export.Id;
            }

            // Save the export ID, you'll need it for polling and getting the exported file
            return exportId;
        }

        /// <summary>
        /// PollExportRequest
        /// </summary>
        /// <param name="reportId"></param>
        /// <param name="groupId"></param>
        /// <param name="exportId"></param>
        /// <param name="timeOutInMinutes"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        private async Task<HttpOperationResponse<Export>> PollExportRequest(Guid reportId, Guid groupId, string exportId, int timeOutInMinutes, CancellationToken token)
        {
            HttpOperationResponse<Export> httpMessage = null;
            Export exportStatus = null;
            DateTime startTime = DateTime.UtcNow;
            const int c_secToMillisec = 1000;
            do
            {
                if (DateTime.UtcNow.Subtract(startTime).TotalMinutes > timeOutInMinutes || token.IsCancellationRequested)
                {
                    // Error handling for timeout and cancellations 
                    return null;
                }

                // The 'Client' object is an instance of the Power BI .NET SDK
                using (var client = await GetPowerBiClient())
                {
                    httpMessage = await client.Reports.GetExportToFileStatusInGroupWithHttpMessagesAsync(groupId, reportId, exportId);
                    exportStatus = httpMessage.Body;
                }
                if (exportStatus.Status == ExportState.Running || exportStatus.Status == ExportState.NotStarted)
                {
                    // The recommended waiting time between polling requests can be found in the RetryAfter header
                    // Note that this header is not always populated
                    var retryAfter = httpMessage.Response.Headers.RetryAfter;
                    var retryAfterInSec = retryAfter.Delta.Value.Seconds;
                    await Task.Delay(retryAfterInSec * c_secToMillisec);
                }
            }
            // While not in a terminal state, keep polling
            while (exportStatus.Status != ExportState.Succeeded && exportStatus.Status != ExportState.Failed);

            return httpMessage;
        }


        /// <summary>
        /// GetExportedFile
        /// </summary>
        /// <param name="reportId"></param>
        /// <param name="groupId"></param>
        /// <param name="export"></param>
        /// <returns></returns>
        private async Task<ExportedFile> GetExportedFile(Guid reportId, Guid groupId, Export export)
        {
            if (export.Status == ExportState.Succeeded)
            {
                // The 'Client' object is an instance of the Power BI .NET SDK
                using (var client = await GetPowerBiClient())
                {
                    var fileStream = await client.Reports.GetFileOfExportToFileAsync(groupId, reportId, export.Id);
                    return new ExportedFile
                    {
                        FileStream = fileStream,
                        FileSuffix = export.ResourceFileExtension,
                    };
                }
            }
            return null;
        }

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
        public async Task<ExportedFile> ExportPowerBIReport(
            Guid reportId,
            Guid groupId,
            FileFormat format,
            int pollingtimeOutInMinutes,
            CancellationToken token,
            string authToken,
            string urlFilter = null)
        {
            const int c_maxNumberOfRetries = 3; /* Can be set to any desired number */
            const int c_secToMillisec = 1000;
            Export export;
            int retryAttempt = 1;
            do
            {
                var exportId = await PostExportRequest(reportId, groupId, format, authToken, urlFilter: urlFilter);
                var httpMessage = await PollExportRequest(reportId, groupId, exportId, pollingtimeOutInMinutes, token);
                export = httpMessage.Body;
                if (export == null)
                {
                    // Error, failure in exporting the report
                    return null;
                }
                if (export.Status == ExportState.Failed)
                {
                    // Some failure cases indicate that the system is currently busy. The entire export operation can be retried after a certain delay
                    // In such cases the recommended waiting time before retrying the entire export operation can be found in the RetryAfter header
                    var retryAfter = httpMessage.Response.Headers.RetryAfter;
                    if (retryAfter == null)
                    {
                        // Failed state with no RetryAfter header indicates that the export failed permanently
                        return null;
                    }

                    var retryAfterInSec = retryAfter.Delta.Value.Seconds;
                    await Task.Delay(retryAfterInSec * c_secToMillisec);
                }
            }
            while (export.Status != ExportState.Succeeded && retryAttempt++ < c_maxNumberOfRetries);

            if (export.Status != ExportState.Succeeded)
            {
                // Error, failure in exporting the report
                return null;
            }

            var exportedFile = await GetExportedFile(reportId, groupId, export);

            return exportedFile;

        }
    }
}
