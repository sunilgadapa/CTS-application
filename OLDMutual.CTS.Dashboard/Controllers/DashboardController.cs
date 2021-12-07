using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OLDMutual.CTS.Dashboard.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Dashboard.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly JsonResult js = new JsonResult();
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dataSubmissionService)
        {
            _dashboardService = dataSubmissionService;
        }

        /// <summary>
        /// Get data load errors
        /// </summary>       
        /// <returns>List Object</returns>
        [HttpGet("GetDataLoadRecentErrors")]
        [Authorize]
        public async Task<IActionResult> GetDataLoadRecentErrors(int PageNumber, int Size)
        {
            try
            {
                var result = await _dashboardService.GetDataLoadRecentErrors(PageNumber, Size);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Data load recent errors not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Data load recent errors found";
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
    }
}
