using OLDMutual.CTS.Reporting.Domain.Models;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Reporting.Service.Interfaces
{
    public interface IPowerBIReportLogService
    {
        Task<string> AddUpdatePowerBIMasterReport(MReport report, int type);
        /// <summary>
        /// Add or update power bi report config
        /// </summary>
        /// <param name="report"></param>
        /// <param name="type"></param>
        /// <returns>error type(error or success)</returns>
        Task<string> AddUpdatePowerBIMasterReportConfig(MReportConfig report, int type);

        /// <summary>
        /// Get Power Bi Report Data
        /// </summary>
        /// <param name="power_bi_report_id"></param>
        /// <param name="env">environment</param>
        /// <returns>PowerBiReport Object</returns>
        Task<PowerBiReport> GetPowerBIMasterReportData(string power_bi_report_id, string env = "");
    }
}
