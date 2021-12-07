using OLDMutual.CTS.Reporting.Domain.Models;
using System;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Reporting.Data.Interfaces
{
    public interface IPowerBiReportLogDao : IDisposable
    {
        Task<string> AddUpdatePowerBIMasterReport(MReport report, int type);
        Task<string> AddUpdatePowerBIMasterReportConfig(MReportConfig report, int type);
        Task<PowerBIReportData> GetPowerBIMasterReportData(string power_bi_report_id, string environment);
    }
}
