using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OLDMutual.CTS.Reporting.Domain.Models;
using OLDMutual.CTS.Reporting.Service.Interfaces;
using System;
using System.Net;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Reporting.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PowerBIReportLogController : Controller
    {
        private readonly JsonResult js = new JsonResult();
        private readonly IPowerBIReportLogService _powerBIReportLogService;
        private readonly IPowerBiServiceApi _powerBiServiceApi;
        public PowerBIReportLogController(IPowerBIReportLogService powerBIReportLogService, IPowerBiServiceApi powerBiServiceApi)
        {
            _powerBIReportLogService = powerBIReportLogService;
            _powerBiServiceApi = powerBiServiceApi;
        }

        /// <summary>
        /// AddUpdatePowerBIMasterReport
        /// </summary>
        /// <param name="report">Report Master Object</param>
        /// <returns>IActionResult</returns>
        [HttpPost("AddUpdatePowerBIMasterReport")]
        /*  
       .......................................................................................................
       * This is the AddUpdatePowerBIMasterReport API
       * @param report is BI repoert
       * AddUpdatePowerBIMasterReport() is used to add or update master repoert
       .......................................................................................................
       */
        public async Task<IActionResult> AddUpdatePowerBIMasterReport(MReport report)
        {
            try
            {
                
                if (report.report_id < 0)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "PLease provice correct report id";
                    js.data = null;
                    return NotFound(js);
                }
                var type = 1;//Add
                if (report.report_id > 0)
                {
                    type = 2;//Edit
                }
                report.created_by = HttpContext.User.Identity.Name;
                var result = await _powerBIReportLogService.AddUpdatePowerBIMasterReport(report, type);

                if (result != "200")
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = result;
                    js.data = result;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Master Report Data Saved successfully.";
                    js.data = result;
                    return Ok(js);
                }


            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }

        /// <summary>
        /// AddUpdatePowerBIMasterReportConfig
        /// </summary>
        /// <param name="report">M_Report_Config Obhect</param>
        /// <returns>IActionResult</returns>
        [HttpPost("AddUpdatePowerBIMasterReportConfig")]
        /*  
       .......................................................................................................
       * This is the AddUpdatePowerBIMasterReportConfig API
       * @param report is BI MReportConfig
       * AddUpdatePowerBIMasterReportConfig() is used to add or update master repoert config
       .......................................................................................................
       */
        public async Task<IActionResult> AddUpdatePowerBIMasterReportConfig(MReportConfig report)
        {
            try
            {
                
                if (report.report_id < 0)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Please provice correct report id.";
                    js.data = null;
                    return NotFound(js);
                }
                else if (report.report_config_id < 0)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Please provice correct report config id.";
                    js.data = null;
                    return NotFound(js);
                }
                var type = 1;//Add
                if (report.report_config_id > 0)
                {
                    type = 2;//Edit
                }
                report.created_by = HttpContext.User.Identity.Name;
                var result = await _powerBIReportLogService.AddUpdatePowerBIMasterReportConfig(report, type);

                if (result != "200")
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = result;
                    js.data = result;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Master Report Data Saved successfully.";
                    js.data = result;
                    return Ok(js);
                }


            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }

        /// <summary>
        /// Get power bi report config data
        /// </summary>
        /// <param name="power_bi_report_id">power bi report id</param>
        /// <param name="env">environment</param>
        /// <returns>IActionResult</returns>
        /// 
        /*  
       .......................................................................................................
       * This is the GetPowerBIMasterReportData API
       * @param power_bi_report_id is used to get report id
       * @param env is envoirnment of build
       * GetPowerBIMasterReportData() is used to add or update master repoert config
       .......................................................................................................
       */
        [HttpGet("GetPowerBIMasterReportData")]

        public async Task<IActionResult> GetPowerBIMasterReportData(string power_bi_report_id,string env="")
        {
            try
            {

                if (string.IsNullOrEmpty(power_bi_report_id))
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Please provice correct report id.";
                    js.data = null;
                    return NotFound(js);
                }
               
                var result = await _powerBIReportLogService.GetPowerBIMasterReportData(power_bi_report_id,env);

                if (result.powerBIReportData == null)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "No Data Found";
                    js.data = result;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Success";
                    js.data = result;
                    return Ok(js);
                }


            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }
        
        /// <summary>
        /// Get Embed report config model
        /// </summary>
        /// <returns></returns>
        [HttpGet("ReportToken")]
        public async Task<IActionResult> Embed()
        {
            Guid workspaceId = new Guid("f090bc4c-3767-47f4-af90-039f205dd434");
            Guid reportId = new Guid("b368a7b0-c792-4721-a26d-11e10f685414");
            var viewModel = await _powerBiServiceApi.GetReport(workspaceId, reportId);
            return Ok(viewModel);
        }

    }

}
