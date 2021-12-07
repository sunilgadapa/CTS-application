using Microsoft.PowerBI.Api;
using OLDMutual.CTS.Reporting.Domain.Models;
using System;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Reporting.Service.Interfaces
{
    public interface IPowerBiServiceApi
    {
        string GetAccessToken();
        Task<EmbeddedReportViewModel> GetReport(Guid WorkspaceId, Guid ReportId);
        PowerBIClient GetPowerBiClient();
    }
}
