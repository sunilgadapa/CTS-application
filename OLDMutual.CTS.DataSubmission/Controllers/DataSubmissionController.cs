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
    public class DataSubmissionController : ControllerBase
    {
        private readonly JsonResult js = new JsonResult();
        private readonly IDataSubmissionService _dataSubmissionService;
        /// <summary>
        /// Constructor of DataSubmissionController
        /// </summary>
        /// <param name="dataSubmissionService"></param>
        public DataSubmissionController(IDataSubmissionService dataSubmissionService)
        {
            _dataSubmissionService = dataSubmissionService;
        }

        /// <summary>
        /// Get Dropdown Value
        /// </summary>
        /// <param name="type">Dropdown type</param>
        /// <returns>List Object</returns>
        [HttpGet("GetDropdowndata")]
        [Authorize]
        public async Task<IActionResult> GetDropdowndata(string type)
        {
            try
            {
                var result = await _dataSubmissionService.GETDropDownData(type);
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
        /// Get SARS Submission Data
        /// </summary>
        /// <param name="data">Input Params</param>
        /// <returns></returns>
        [HttpGet("GetSARSSubmissionData")]
        [Authorize]
        public async Task<IActionResult> GetSARSSubmissionData([FromQuery] SarsSubmissionData data)
        {
            try
            {
                var result = await _dataSubmissionService.GetSARSSubmissionData(data);
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

        [HttpPost("PromoteSubmissionFile")]
        [Authorize]
        public async Task<IActionResult> PromoteSubmissionFile(SarsDataPromotion data)
        {
            try
            {
                var result = await _dataSubmissionService.PromoteSARSSubmission(data);

                if (!result)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Promotion not initiated.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Promotion process started (" + DateTime.UtcNow.ToShortDateString() + " @ " + DateTime.Now.ToShortTimeString() + ")";
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

        [HttpPost("SubmitSARSFile")]
        [Authorize]
        public async Task<IActionResult> SubmitSARSFile(int file_id)
        {
            try
            {
                var result = await _dataSubmissionService.SubmitSARSFile(file_id);

                if (!result)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Submission process is not started.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Physical file process started (" + DateTime.UtcNow.ToShortDateString() + " @ " + DateTime.Now.ToShortTimeString() + ")";
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

        [HttpPost("DeletSubmissionFile")]
        [Authorize]
        public async Task<IActionResult> DeletSubmissionFile(List<FileModel> sarsSubmissionData)
        {
            try
            {
                var result = await _dataSubmissionService.DeleteSARSSubmission(sarsSubmissionData);

                if (!result)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "File is not deleted.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "File deleted successfully.";
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
        /// Delere sars submission error data
        /// </summary>
        /// <param name="sarsSubmissionErrorData">Array of error file id</param>
        /// <param name="fileType">file type</param>
        /// <returns></returns>
        [HttpPost("DeletSubmissionErrorFile")]
        [Authorize]
        public async Task<IActionResult> DeleteErrorRecord(List<FileModel> sarsSubmissionErrorData, string fileType = "")
        {
            try
            {
                var result = await _dataSubmissionService.DeleteErrorRecord(sarsSubmissionErrorData, fileType);

                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "File is not deleted.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "File deleted successfully.";
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
        /// Generate SARS submission snapshot .
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <param name="fileRegionId">file Region Id</param>
        /// <returns>true false</returns>
        [HttpPost("GenerateSnapshot")]
        [Authorize]
        public async Task<IActionResult> GenerateSnapshot(int file_id, int fileRegionId)
        {
            try
            {
                var result = await _dataSubmissionService.GenerateSnapshot(file_id, fileRegionId);

                if (!result)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Snapshot is not generated.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Snapshot generated successfully.";
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
        /// Get All the urle for button visibility in UI
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetActionRules")]
        [Authorize]
        public async Task<IActionResult> GetActionRules()
        {
            try
            {
                var result = await _dataSubmissionService.GetActionRules();
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "No data found";
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="page"> Page Index</param>
        /// <param name="size">Page Size</param>
        /// <param name="file_Id">file_Id</param>
        /// <returns></returns>
        [HttpGet("GetSarsSubmissionErrorData")]
        [Authorize]
        public async Task<IActionResult> ViewSarsErrorReport(int page, int size, int file_Id)
        {
            try
            {
                var result = await _dataSubmissionService.ViewErrorReport(page, size, file_Id);
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "No data found";
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="page"></param>
        /// <param name="size"></param>
        /// <returns></returns>
        [HttpGet("GetSarsUnPromotedData")]
        [Authorize]
        public async Task<IActionResult> ViewSarsUnPromotedData(int page, int size)
        {
            try
            {
                var result = await _dataSubmissionService.ViewSarsUnPromotedData(page, size);
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "No data found";
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
