using Microsoft.Extensions.Options;
using OLDMutual.CTS.Reporting.Data.Interfaces;
using OLDMutual.CTS.Reporting.Domain.Models;
using OLDMutual.CTS.Reporting.Service.Interfaces;
using OLDMutual.CTS.Reporting.Shared.Configuration;
using System;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Reporting.Service.Services
{
    public class PowerBIReportLogService : IPowerBIReportLogService
    {
        private readonly IPowerBiReportLogDao _powerBIReportLogDao;
        private readonly PowerBISettings _powerBISettings;
        private readonly IConfigurationSettings _configurationSettings;
        private readonly IEmbedService _embedService;
        public PowerBIReportLogService(IOptions<PowerBISettings> powerBISettings, IPowerBiReportLogDao powerBIReportLogDao,
            IConfigurationSettings configurationSettings, IEmbedService embedService)
        {
            _configurationSettings = configurationSettings;
            _powerBISettings = powerBISettings.Value;
            _embedService = embedService;
            _powerBIReportLogDao = powerBIReportLogDao;
        }

        /// <summary>
        /// Add And Edir Power Bi Report
        /// </summary>
        /// <param name="report">report object for power BI</param>
        /// <param name="type">Action Type.Add Or Edit</param>
        /// <returns>success code</returns>
        public async Task<string> AddUpdatePowerBIMasterReport(MReport report, int type)
        {
            var result = await _powerBIReportLogDao.AddUpdatePowerBIMasterReport(report, type);
            return result;
        }

        /// <summary>
        /// Add or update power bi report config
        /// </summary>
        /// <param name="report"></param>
        /// <param name="type"></param>
        /// <returns>error type(error or success)</returns>
        public async Task<string> AddUpdatePowerBIMasterReportConfig(MReportConfig report, int type)
        {
            var config = _configurationSettings.GetEnvironment();
            var reportURL = "{BaseUrl}reportEmbed?reportId={reportId}&groupId={groupId}";
            reportURL = reportURL.Replace("{BaseUrl}", _powerBISettings.powerBIBaseUrl)
                .Replace("{reportId}", report.power_bi_report_id)
                .Replace("{groupId}", report.power_bi_group_id);
            report.report_storage_type = string.IsNullOrEmpty(report.report_storage_type) ? "Power Bi" : report.report_storage_type;
            report.environment = config.Item1;
            report.database_name = config.Item2;
            report.report_url = reportURL;

            var result = await _powerBIReportLogDao.AddUpdatePowerBIMasterReportConfig(report, type);
            return result;

        }

        /// <summary>
        /// Get Power Bi Report Data
        /// </summary>
        /// <param name="power_bi_report_id"></param>
        /// <param name="env">environment</param>
        /// <returns>PowerBiReport Object</returns>
        public async Task<PowerBiReport> GetPowerBIMasterReportData(string power_bi_report_id, string env = "")
        {
            if (string.IsNullOrEmpty(env))
            {
                env = _configurationSettings.GetEnvironment().Item1;
            }
            var embedResult = new ReportEmbedConfig();
            var powerBiReport = new PowerBiReport();
            var result = await _powerBIReportLogDao.GetPowerBIMasterReportData(power_bi_report_id, env);
            if (result != null)
            {
                embedResult = await _embedService.GetEmbedParams(new Guid(result.power_bi_group_id), new Guid(result.power_bi_report_id));
            }
            powerBiReport.powerBIReportData = result;
            powerBiReport.reportEmbedConfig = embedResult;
            return powerBiReport;

        }
    }
}
