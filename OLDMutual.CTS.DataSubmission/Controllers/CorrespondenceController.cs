using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OLDMutual.CTS.DataSubmission.Service.Interfaces;
using System.Net;
using OLDMutual.CTS.DataSubmission.Domain.Models;

namespace OLDMutual.CTS.DataSubmission.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CorrespondenceController : ControllerBase
    {
        private readonly JsonResult js = new JsonResult();
        private readonly ICorrespondenceService _correspondenceService;
        /// <summary>
        /// Constructor of CorrespondenceController
        /// </summary>
        /// <param name="correspondenceService"></param>
        public CorrespondenceController(ICorrespondenceService correspondenceService)
        {
            _correspondenceService = correspondenceService;
        }

        /// <summary>
        /// Get Dropdown Value
        /// </summary>
        /// <param name="type">Dropdown type</param>
        /// <returns>List Object</returns>
        [HttpGet("GetCorrespondenceDropdowndata")]
        [Authorize]
        public async Task<IActionResult> GetCorrespondenceDropdowndata(string type)
        {
            try
            {
                var result = await _correspondenceService.GetCorrespondenceDropdowndata(type);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = type + " data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = type + " data  found";
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
        /// Get Dropdown Value
        /// </summary>
        /// <param name="type">Dropdown type</param>
        /// <returns>List Object</returns>
        [HttpGet("GetCorrespondenceDropdownTypeEnv")]
        [Authorize]
        public async Task<IActionResult> GetCorrespondenceDropdownTypeEnv(string type)
        {
            try
            {
                var result = await _correspondenceService.GetCorrespondenceDropdownTypeEnv(type);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = type + " data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = type + " data  found";
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
        /// Get Correspondence Data
        /// </summary>
        /// <param name="data">CorrespondenceData type</param>
        /// <returns>List Object</returns>
        [HttpGet("GetCorrespondenceData")]
        [Authorize]
        public async Task<IActionResult> GetCorrespondenceData([FromQuery] CorrespondenceData data)
        {
            try
            {
                var result = await _correspondenceService.GetCorrespondenceData(data);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Data found";
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
