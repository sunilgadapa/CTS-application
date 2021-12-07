using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using Microsoft.PowerBI.Api.Models;
using Microsoft.Rest;
using OLDMutual.CTS.Reporting.Domain.Models;
using OLDMutual.CTS.Reporting.Service.Interfaces;
using System;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Reporting.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PowerBIController : Controller
    {
        private readonly JsonResult js = new JsonResult();
        private readonly IConfigValidatorService _configValidatorService;
        private readonly IEmbedService _embedService;
        private readonly PowerBISettings _powerBISettings;

        public PowerBIController(IOptions<PowerBISettings> powerBISettings, IConfigValidatorService configValidatorService, IEmbedService embedService)
        {
            _powerBISettings = powerBISettings.Value;
            _configValidatorService = configValidatorService;
            _embedService = embedService;
        }

        /// <summary>
        /// Get embad repot data from power bi REST API
        /// </summary>
        /// <returns></returns>
        /// 
        /*  
       .......................................................................................................
       * This is the EmbedReport API
      
       * EmbedReport() is used to get report
       .......................................................................................................
       */
        [HttpPost("GetEmbedReportData")]
        [Authorize]
        public async Task<ActionResult> EmbedReport()
        {
            var m_errorMessage = _configValidatorService.GetWebConfigErrors();
            if (!string.IsNullOrWhiteSpace(m_errorMessage))
            {
                return NotFound(BuildErrorModel(m_errorMessage));
            }

            try
            {
                var embedResult = await _embedService.GetEmbedParams(new Guid(_powerBISettings.WorkspaceId), new Guid(_powerBISettings.ReportId));
                return Ok(embedResult);
            }
            catch (HttpOperationException exc)
            {
                m_errorMessage = string.Format("Status: {0} ({1})\r\nResponse: {2}\r\nRequestId: {3}", exc.Response.StatusCode, (int)exc.Response.StatusCode, exc.Response.Content, exc.Response.Headers["RequestId"].FirstOrDefault());
                return BadRequest(m_errorMessage);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="reportId">reportId</param>
        /// <param name="groupId">groupId</param>
        /// <param name="format">report format</param>
        /// <param name="pollingtimeOutInMinutes">polling time Out In Minutes</param>
        /// <param name="token">token</param>
        /// <param name="urlFilter">urlFilter</param>
        /// <returns></returns>
        /// 
         /*  
       .......................................................................................................
       * This is the ExportReports API
       * @param reportId is used to get repoert by ID
       * @param user is used to get user specific JSON body
       * @param groupId is used to get groupId
       * @param format is used to get file format
       * @param pollingtimeOutInMinutes is used
       * @param token is used to get token
       * @param urlFilter is used 
       * ExportReports() is used to get Export report
       .......................................................................................................
       */
        [HttpPost("ExportReports")]
        [Authorize]
        public async Task<ActionResult> ExportReports(string reportId,
            string groupId,
            FileFormat format,
            int pollingtimeOutInMinutes,
            CancellationToken token,
            string urlFilter = null)
        {
            try
            {

                var authorization = HttpContext.Request.Headers[HeaderNames.Authorization];
                var authToken = string.Empty;
                if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue))
                {
                    // we have a valid AuthenticationHeaderValue that has the following details:

                    authToken = headerValue.Parameter;

                    // scheme will be "Bearer"
                    // parmameter will be the token itself.
                }
                var result = await _embedService.ExportPowerBIReport(new Guid(reportId), new Guid(groupId), format, pollingtimeOutInMinutes, token, authToken, urlFilter);
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = " data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = " data  found";
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
        static ErrorModel BuildErrorModel(string errorMessage)
        {
            return new ErrorModel
            {
                ErrorMessage = errorMessage
            };
        }
    }
}