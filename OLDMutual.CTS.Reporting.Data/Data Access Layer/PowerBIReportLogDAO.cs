using Dapper;
using OLDMutual.CTS.Reporting.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.Reporting.Data.Interfaces;
using OLDMutual.CTS.Reporting.Domain.Models;
using System;
using System.Data;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Reporting.Data.Data_Access_Layer
{
    public class PowerBiReportLogDao : IPowerBiReportLogDao
    {
        private readonly IDapper _dapper;
        public PowerBiReportLogDao(IDapper dapper)
        {
            _dapper = dapper;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            // Cleanup
        }

        public async Task<string> AddUpdatePowerBIMasterReport(MReport report, int type)
        {
            string Query = "SP_SavePowerBIReportData";
            DynamicParameters param = new DynamicParameters();
            param.Add("@action_type", type);
            param.Add("@report_id", report.report_id);
            param.Add("@report_name", report.report_name);
            param.Add("@report_description", report.report_description);
            param.Add("@status", report.status_flag);
            param.Add("@UserId", report.created_by);

            var result = await Task.FromResult(_dapper.Get<string>(Query, param, commandType: CommandType.StoredProcedure));
            return result.ToString();

        }

        public async Task<string> AddUpdatePowerBIMasterReportConfig(MReportConfig report, int type)
        {

            string Query = "SP_SavePowerBIReportConfigData";
            DynamicParameters param = new DynamicParameters();
            param.Add("@action_type", type);
            param.Add("@report_config_id", report.report_config_id);
            param.Add("@report_id", report.report_id);
            param.Add("@environment", report.environment);
            param.Add("@power_bi_report_id", report.power_bi_report_id);
            param.Add("@power_bi_group_id", report.power_bi_group_id);
            param.Add("@power_bi_data_id", report.power_bi_dataset_id);
            param.Add("@report_url", report.report_url);
            param.Add("@report_storage_type", report.report_storage_type);
            param.Add("@status", report.status_flag);
            param.Add("@UserId", report.created_by);

            var result = await Task.FromResult(_dapper.Get<string>(Query, param, commandType: CommandType.StoredProcedure));
            return result.ToString();
        }

        public async Task<PowerBIReportData> GetPowerBIMasterReportData(string power_bi_report_id, string environment)
        {
            string Query = "SP_GETPowerBIReportData";
            DynamicParameters param = new DynamicParameters();
            param.Add("@power_bi_report_id", power_bi_report_id);
            param.Add("@Environment", environment);
            var result = await Task.FromResult(_dapper.Get<PowerBIReportData>(Query, param, commandType: CommandType.StoredProcedure));
            return result;
        }
    }
}
