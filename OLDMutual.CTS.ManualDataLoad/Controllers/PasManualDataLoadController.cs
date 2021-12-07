using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OLDMutual.CTS.ManualDataLoad.Domain.Models;
using OLDMutual.CTS.ManualDataLoad.Domain.Validators;
using OLDMutual.CTS.ManualDataLoad.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace OLDMutual.CTS.ManualDataLoad.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PasManualDataLoadController : ControllerBase
    {
        readonly JsonResult js = new JsonResult();
        private readonly IManualDataLoadService _manualDataLoadService;

        public PasManualDataLoadController(IManualDataLoadService manualDataLoadService)
        {
            _manualDataLoadService = manualDataLoadService;
        }
        [HttpPost("GetPasDataLoad")]
        public async Task<IActionResult> GetPasDataLoad(DataLoad data)
        {
            try
            {
                var result = await _manualDataLoadService.GetPasDataLoad(data);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "PAS manual upload data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "PAS manual upload data found";
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

        [HttpPost("Signoff")]
        public async Task<IActionResult> Signoff(SignOffDto lookupdata)
        {
            try
            {
                StatusmodelValidator _validator = new StatusmodelValidator();
                var res = _validator.Validate(lookupdata);

                if (!res.IsValid)
                {
                    List<string> ValidationMessages = new List<string>();

                    foreach (ValidationFailure failure in res.Errors)
                    {
                        ValidationMessages.Add(failure.PropertyName + ": " + failure.ErrorMessage);
                    }
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Internal server error";
                    js.data = ValidationMessages;
                    return NotFound(js);

                }
                else
                {
                    var result = await _manualDataLoadService.SignOffFile(lookupdata);
                    if (result == 0)
                    {
                        js.Statuscode = (int)HttpStatusCode.NotFound;
                        js.Message = "Facing issue while signing off.";
                        js.data = null;
                        return NotFound(js);
                    }
                    else
                    {
                        js.Statuscode = (int)HttpStatusCode.OK;
                        js.Message = "Signed off successfully.";
                        js.data = null;
                        return Ok(js);
                    }
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.InnerException.Message;
                return BadRequest(js);
            }

        }

        [HttpGet("GetPasFileDataById")]
        [Authorize]
        public async Task<IActionResult> GetPasFileDataById(int file_id)
        {
            try
            {
                var result = await _manualDataLoadService.GetPasFileDataById(file_id);
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "PAS manual upload data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "PAS manual upload data found";
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

        [HttpPost("UpdateMemberFileErrorData")]
        [Authorize]
        public async Task<IActionResult> UpdateMemberFileErrorData([FromForm] ListMemberData ErrorData)
        {
            try
            {
                var result = await _manualDataLoadService.UpdateMemberFileErrorData(ErrorData.MemberData);

                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Facing issue while updating the selected record.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Error updated successfully";
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

        [HttpPost("UpdateAdvisorFileErrorData")]
        [Authorize]
        public async Task<IActionResult> UpdateAdvisorFileErrorData([FromForm] ListAdvisorDetailData ErrorData)
        {
            try
            {
                var result = await _manualDataLoadService.UpdateAdvisorFileErrorData(ErrorData.AdvisorData);

                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Facing issue while updating the selected record.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Error updated successfully";
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

        [HttpPost("UpdateFinanceFileErrorData")]
        [Authorize]
        public async Task<IActionResult> UpdateFinanceFileErrorData([FromForm] ListFinanceData ErrorData)
        {
            try
            {
                var result = await _manualDataLoadService.UpdateFinanceFileErrorData(ErrorData.FinanceData);

                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Facing issue while updating the selected record.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Error updated successfully";
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

        [HttpGet("GetPasDataLoadError")]
        [Authorize]
        public async Task<IActionResult> GetPasDataLoadError(int file_id, int documment_type_id, int page_no, int size)
        {
            try
            {
                var result = await _manualDataLoadService.GetPasDataLoadError(file_id, documment_type_id, page_no, size);
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Error record not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Error data found";
                    js.data = result;
                    return Ok(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.NotFound;
                js.Message = ex.Message.ToString();
                js.data = null;
                return NotFound(js);
            }

        }

        [HttpGet("GetPasDataLoadErrorHeader")]
        [Authorize]
        public async Task<IActionResult> GetPasDataLoadErrorHeader(int file_id, int documment_type_id, int page_no, int size)
        {
            try
            {
                var result = await _manualDataLoadService.GetPasDataLoadErrorHeader(file_id, documment_type_id, page_no, size);
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Error record not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Error data found";
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
        [HttpGet("CheckIfFileHasMissingInformation")]
        [Authorize]
        public async Task<IActionResult> CheckIfFileHasMissingInformation(int document_type_id, int file_id)
        {
            try
            {
                int result = await _manualDataLoadService.CheckIfFileHasMissingInformation(document_type_id, file_id);
                if (result == 1)
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "File contains the missing information";
                    js.data = result;
                    return Ok(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "File does not contains the missing information";
                    js.data = result;
                    return NotFound(js);
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
        [HttpGet("GetMissingInformationByFileId")]
        [Authorize]
        public async Task<IActionResult> GetMissingInformationByFileId(int document_type_id, int file_id)
        {
            try
            {
                var result = await _manualDataLoadService.GetMissingInformationByFileId(document_type_id, file_id);
                if (result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Missing information data found";
                    js.data = result;
                    return Ok(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "No missing information found. Please reprocess the file.";
                    js.data = result;
                    return NotFound(js);
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
        [HttpGet("AddPasMissingInformation")]
        [Authorize]
        public async Task<IActionResult> AddPasMissingInformation(string LookupValueName, string LookupValueDescription, string LookupTypeName, int FileId, string misc_value)
        {
            try
            {
                int result = await _manualDataLoadService.AddPasMissingInformation(LookupValueName, LookupValueDescription, LookupTypeName, FileId, misc_value);
                if (result == 1)
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Missing information already exists! Refreshing...";
                    js.data = result;
                    return Ok(js);
                }
                else if (result == 2)
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Missing information added successfully.";
                    js.data = result;
                    return Ok(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Failed to add the missing information.";
                    js.data = result;
                    return NotFound(js);
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
        [HttpGet("CheckIfLookupExists")]
        [Authorize]
        public async Task<IActionResult> CheckIfLookupExists(string LookupValueName, string LookupTypeName, int FileId)
        {
            try
            {
                int result = await _manualDataLoadService.CheckIfLookupExists(LookupValueName, LookupTypeName, FileId);
                if (result == 1)
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Missing information already exists! Refreshing...";
                    js.data = result;
                    return Ok(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Missing information not found.";
                    js.data = null;
                    return NotFound(js);
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
        [HttpPost("AddMissingTaxPeriodData")]
        [Authorize]
        public async Task<IActionResult> AddMissingTaxPeriodData(TaxPeriodDto taxPeriodDto)
        {
            try
            {
                int result = await _manualDataLoadService.AddMissingTaxPeriodData(taxPeriodDto);
                if (result == 1)
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Missing information already exists! Refreshing...";
                    js.data = result;
                    return Ok(js);
                }
                else if (result == 2)
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Missing information added successfully.";
                    js.data = result;
                    return Ok(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Failed to add the missing information.";
                    js.data = result;
                    return NotFound(js);
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
        [HttpPost("ReprocessFile")]
        [Authorize]
        public async Task<IActionResult> ReprocessFile(int DocumentTypeId, int FileId)
        {
            try
            {
                int result = await _manualDataLoadService.ReprocessFile(DocumentTypeId, FileId);
                if (result == 1)
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "File successfully reprocessed.";
                    js.data = result;
                    return Ok(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Failed to reprocess the file.";
                    js.data = result;
                    return NotFound(js);
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
