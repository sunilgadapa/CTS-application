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
    public class DomainController : ControllerBase
    {
        private readonly IDomainDefinitionService _domainDefinitionService;
        public DomainController(IDomainDefinitionService domainDefinitionService)
        {
            _domainDefinitionService = domainDefinitionService;
        }
        #region Domain Definition
        [HttpPost("AddEditDomainData")]

        /*  
         .......................................................................................................
        * This is the AddEditDomainDefinition API
        * @param domainDef is used to get Domain specific JSON body
        * AddEditDomainDefinition() is used to add or update the domain defination
        .......................................................................................................
        */
        public async Task<IActionResult> AddEditDomainDefinition(DomainDefData domainDef)
        {
            JsonResult js = new JsonResult();
            try
            {
                DomainDefDataValidator _validator = new DomainDefDataValidator();
                var res = _validator.Validate(domainDef);
                if (!res.IsValid)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Please select all mandatory fields";
                    js.data = null;
                    return BadRequest(js);
                }
                var lookupvaluedata = await _domainDefinitionService.AddEditDomainDefinition(domainDef);
                if (lookupvaluedata == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some error occured";
                    js.data = null;
                    return NotFound(js);
                }
                else if(lookupvaluedata == -99)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Data already exists.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    string message = (domainDef.lookup_type_id > 0) ? "updated" : "added";
                    js.Message =  "Data " + message + " successfully.";
                    js.data = lookupvaluedata;
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
       * This is the GetDomainDefinition API
       * @param domainDef is used to get Domain specific JSON body
       * GetDomainDefinition() is used to get a domain defination
       .......................................................................................................
       */
        [HttpPost("GetDomainDef")]
        public async Task<IActionResult> GetDomainDefinition(DomainDefData domaindef)
        {
            JsonResult js = new JsonResult();
            try
            {
                var domain = await _domainDefinitionService.GetDomainDefination(domaindef);
                if (!domain.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Domain  defintation data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Domain defintation  data  found";
                    js.data = domain;
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
        * This is the SaveDomainDefinition API
        * @param ids is used to get Domain specific ids
        * SaveDomainDefinition() is used to save (active/deactive) a domain defination
        .......................................................................................................
        */
        [HttpPost("SaveDomainDef")]
        public async Task<IActionResult> SaveDomainDefinition(SaveLookup ids)
        {
            JsonResult js = new JsonResult();
            try
            {
                SaveLookupDtoValidator _validator = new SaveLookupDtoValidator();
                var ValidationMessages = _validator.ValidateLookUp(ids);
                if (ValidationMessages.Count > 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some error occured";
                    js.data = ValidationMessages;
                    return BadRequest(js);
                }
                var result = await _domainDefinitionService.SaveDomainDefinition(ids);
                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Selected domain defintation data not found.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Changes saved successfully.";
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
        #endregion
        #region Domain Reference

        /*  
        .......................................................................................................
       * This is the AddEditDomainReference API
       * @param domainRef is used to get Domain reference specific JSON body
       * AddEditDomainReference() is used to add or update the domain reference
       .......................................................................................................
       */
        [HttpPost("AddEditDomainRefData")]
        public async Task<IActionResult> AddEditDomainReference(DomainRefData domainRef)
        {
            JsonResult js = new JsonResult();
            try
            {
                DomainRefDataValidator _validator = new DomainRefDataValidator();
                var res = _validator.Validate(domainRef);
                if (!res.IsValid)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some error occured";
                    js.data = null;
                    return BadRequest(js);

                }
                var lookupvaluedata = await _domainDefinitionService.AddEditDomainReference(domainRef);
                if (lookupvaluedata == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some error occured";
                    js.data = null;
                    return NotFound(js);
                }
                else if (lookupvaluedata == -99)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Data already exists.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    string message = (domainRef.lookup_value_id > 0) ? "updated" : "added";
                    js.Message = "Data " + message + " successfully.";
                    js.data = lookupvaluedata;
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
      * This is the GetDomainReference API
      * @param domainRef is used to get Domain specific JSON body
      * GetDomainReference() is used to get a domain reference
      .......................................................................................................
      */
        [HttpPost("GetDomainRef")]
        public async Task<IActionResult> GetDomainReference(DomainRefData domainRef)
        {
            JsonResult js = new JsonResult();
            try
            {
                var domain = await _domainDefinitionService.GetDomainReference(domainRef);
                if (!domain.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Domain  reference data not found.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Domain reference data found.";
                    js.data = domain;
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
        * This is the SaveDomainReference API
        * @param ids is used to get Domain reference specific ids
        * SaveDomainReference() is used to save (active/deactive) a domain reference
        .......................................................................................................
        */
        [HttpPost("SaveDomainRef")]  
        public async Task<IActionResult> SaveDomainReference(SaveLookup ids)
        {
            JsonResult js = new JsonResult();
            try
            {
                SaveLookupDtoValidator _validator = new SaveLookupDtoValidator();
                var ValidationMessages = _validator.ValidateLookUp(ids);
                if (ValidationMessages.Count > 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some Error occured";
                    js.data = ValidationMessages;
                    return BadRequest(js);
                }
                var result = await _domainDefinitionService.SaveDomainReference(ids);
                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Selected domain reference data not found.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Changes saved successfully.";
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
        #endregion
    }
}
