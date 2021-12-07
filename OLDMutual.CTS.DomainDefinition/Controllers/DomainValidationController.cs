using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OLDMutual.CTS.DomainDefinition.Domain.Models;
using OLDMutual.CTS.DomainDefinition.Domain.Validators;
using OLDMutual.CTS.DomainDefinition.Service.Interfaces;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace OLDMutual.CTS.DomainDefinition.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DomainValidationController : ControllerBase
    {
        private readonly IDomainValidationService _domainValidationService;
        public DomainValidationController(IDomainValidationService domainValidationService)
        {
            _domainValidationService = domainValidationService;
        }

        /*  
        .......................................................................................................
        * This is the GetValidationType API
        * @param validationType is used to get type of validation
        * GetValidationType() is used to get validation rule for specific validation type
        .......................................................................................................
        */
        [HttpGet("GetValidationType")]
        public async Task<IActionResult> GetValidationType(string validationType)
        {
            JsonResult js = new JsonResult();
            try
            {
                var data = await _domainValidationService.GetValidationType(validationType);
                if (!data.Any())
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
                    js.data = data;
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

        /*  
        .......................................................................................................
        * This is the GetValidationRule API
        * @param lookup_value_id is used to get lookup value specific validation rules
        * GetValidationRule() is used to get validation rules for specific lookup value
        .......................................................................................................
        */
        [HttpGet("GetValidationRule")]
        public async Task<IActionResult> GetValidationRule(int lookup_value_id)
        {
            JsonResult js = new JsonResult();
            try
            {
                var data = await _domainValidationService.GetValidationRule(lookup_value_id);
                if (!data.Any())
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
                    js.data = data;
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


        /*  
       .......................................................................................................
       * This is the SaveValidationRule API
       * @param domainValidationDto is used to get domain valiadation
       * SaveValidationRule() is used to save validation rules for specific lookup value
       .......................................................................................................
       */
        [HttpPost("SaveValidationRule")]
        public async Task<IActionResult> SaveValidationRule(DomainValidationDto domainValidationDto)
        {
            JsonResult js = new JsonResult();
            try
            {
                SaveValidationRuleValidator _validator = new SaveValidationRuleValidator();
                var res = _validator.Validate(domainValidationDto);
                if (!res.IsValid)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Invalid request";
                    js.data = null;
                    return BadRequest(js);
                }
                var data = await _domainValidationService.SaveValidationRule(domainValidationDto);
                if (data == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "No validation rule saved/update";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Validation rule saved successfully.";
                    js.data = null;
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
