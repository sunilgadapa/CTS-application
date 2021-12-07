using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OLDMutual.CTS.Admin.Domain.Models;
using OLDMutual.CTS.Admin.Domain.Validators;
using OLDMutual.CTS.Admin.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Admin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdminController : Controller
    {
        private readonly IAdminConfigurationService _adminConfigurationService;
        public AdminController(IAdminConfigurationService adminConfigurationService)
        {
            _adminConfigurationService = adminConfigurationService;
        }
        #region LookupData
        /*  
       .......................................................................................................
       * This is the GetLookupValue GET API
       * @param lookup_type_name is used to get the lookup type name
       * @param page_no is used to get the page number
       * GetLookupValueAsync() is used to retrive lookup values for given lookup type
       .......................................................................................................
       */
        [HttpGet("GetLookupValue")]
        public async Task<IActionResult> GetLookupValueAsync(string lookup_type_name, int? page_no)
        {
            JsonResult js = new JsonResult();
            try
            {
                var sourcesystem = await _adminConfigurationService.GetLookUpdata(lookup_type_name, null, page_no);
                if (!sourcesystem.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = lookup_type_name + " data not found";
                    js.data = null;
                    return BadRequest(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = lookup_type_name + " data  found";
                    js.data = sourcesystem;
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
       * This is the GetLookupValueById GET API
       * @param lookup_type_name is used to get the lookup type name
       * @param lookup_value_id is used to get the lookup value id
       * GetLookupValueByIdAsync() is used to retrive lookup values for given lookup type name and lookup value id
       .......................................................................................................
       */
        [HttpGet("GetLookupValueById")]
        public async Task<IActionResult> GetLookupValueByIdAsync(int? lookup_value_id, string lookup_type_name)
        {
            JsonResult js = new JsonResult();
            try
            {
                if (lookup_value_id == null || lookup_value_id == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Value can not be null or zero!";
                    js.data = null;
                    return BadRequest(js);
                }
                var lookupdata = await _adminConfigurationService.GetLookUpdata(lookup_type_name, lookup_value_id, null);
                if (!lookupdata.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = lookup_type_name + " data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = lookup_type_name + " data  found";
                    js.data = lookupdata;
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
       * This is the AddEditLookupValue POST API
       * @param lookup is used to data to be inserted in JSON format       
       * AddEditLookupValueAsync() is used to add or edit the lookup values
       .......................................................................................................
       */
        [HttpPost("AddEditLookupValue")]
        public async Task<IActionResult> AddEditLookupValueAsync(LookupData lookup)
        {
            JsonResult js = new JsonResult();
            try
            {
                LookupDataValidator _validator = new LookupDataValidator();
                var res = _validator.Validate(lookup);
                if (!res.IsValid)
                {
                    List<string> ValidationMessages = new List<string>();
                    foreach (ValidationFailure failure in res.Errors)
                    {
                        ValidationMessages.Add(failure.PropertyName + ": " + failure.ErrorMessage);
                    }
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Validation Error";
                    js.data = ValidationMessages;
                    return BadRequest(js);

                }
                var lookupvaluedata = await _adminConfigurationService.AddEditLookUpdata(lookup);
                if (lookupvaluedata == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = lookup.lookup_type_name + " already exists";
                    js.data = null;
                    return BadRequest(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    string message = (lookup.lookup_value_id > 0) ? "updated" : "added";
                    js.Message = lookup.lookup_type_name + " " + message + " successfully.";
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
       * This is the SaveLookup POST API
       * @param ids is used to get the ids to  in JSON format       
       * SaveLookup() is used to active/inactive selected lookup values
       .......................................................................................................
       */
        [HttpPost("SaveLookup")]
        public async Task<IActionResult> SaveLookup(SaveLookup ids)
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
                var result = await _adminConfigurationService.SaveLookup(ids);
                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = char.ToUpper(ids.lookup_type_name[0]) + ids.lookup_type_name.Substring(1).ToLower() + " not saved.";
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
                js.Message = ex.InnerException.Message;
                return BadRequest(js);
            }

        }
        #endregion
        #region Miscellaneous
        /*  
       .......................................................................................................
       * This is the GetMiscDropDownValue GET API
       * @param lookup_type_name is used to get the lookup type name
       * @param type is used to get the type of lookup type name like legal,miscellaneous etc.
       * GetMiscDropDownValueAsync() is used to bind the drop down values on the entity popup
       .......................................................................................................
       */
        [HttpGet("GetMiscDropDownValue")]
        public async Task<IActionResult> GetMiscDropDownValueAsync(string lookup_type_name, string type)
        {
            JsonResult js = new JsonResult();
            try
            {
                var result = await _adminConfigurationService.GetMiscDropDownpdata(lookup_type_name, type);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = lookup_type_name + " data not found";
                    js.data = null;
                    return BadRequest(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = lookup_type_name + " data  found";
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
        /*  
       .......................................................................................................
       * This is the GetMiscDDLDataByTaxModuleId GET API
       * @param lookup_type_name is used to get the lookup type name
       * @param lookup_value_id is used to get the lookup value id
       * GetMiscDDLDataByTaxModuleId() is used to retrieve the lookup values specific to the tax type
       .......................................................................................................
       */
        [HttpGet("GetMiscDDLDataByTaxModuleId")]
        public async Task<IActionResult> GetMiscDDLDataByTaxModuleId(string lookup_type_name, int lookup_value_id)
        {
            JsonResult js = new JsonResult();
            try
            {
                var result = await _adminConfigurationService.GetMiscDDLDataByTaxModuleId(lookup_type_name, lookup_value_id);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = lookup_type_name + " data not found";
                    js.data = null;
                    return BadRequest(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = lookup_type_name + " data  found";
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
        /*  
       .......................................................................................................
       * This is the GetMiscDDLDataByTaxModuleId POST API
       * @param MiscData is used to get JSON data as request body to retrive the miscellaneous data       
       * GetMiscellanousDataAsync() is used to retrieve the miscellaneous data on the entity popup
       .......................................................................................................
       */
        [HttpPost("GetMiscellanousData")]
        public async Task<IActionResult> GetMiscellanousDataAsync(LookupMiscData MiscData)
        {
            JsonResult js = new JsonResult();
            try
            {
                var result = await _adminConfigurationService.GetMiscData(MiscData);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Miscellaenous data not found";
                    js.data = null;
                    return BadRequest(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Miscellaenous data  found";
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
        /*  
        .......................................................................................................
        * This is the AddEditMiscData POST API
        * @param lookup is used to get JSON data as request body to store the miscellaneous data       
        * AddEditMiscDataAsync() is used to store the miscellaneous data on the entity popup
        .......................................................................................................
        */
        [HttpPost("AddEditMiscData")]
        public async Task<IActionResult> AddEditMiscDataAsync([FromForm] Miscellaneousdata lookup)
        {
            JsonResult js = new JsonResult();
            try
            {
                if (!ModelState.IsValid)
                {
                    List<string> ValidationMessages;

                    ValidationMessages = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage).ToList();
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some Error occured";
                    js.data = ValidationMessages;
                    return BadRequest(js);

                }
                var result = await _adminConfigurationService.AddEditMisc(lookup.MiscData);
                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some error occured";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Data saved successfully.";
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
        #endregion        
        #region Communicationdata
        /*  
        .......................................................................................................
        * This is the GetDropDownData GET API
        * @param type is used to get the type as a request header   
        * @param province_id is used to get the province id as a request header 
        * @param country_id is used to get the country id as a request header 
        * @param city_id is used to get the city id as a request header 
        * GetDropDownDataAsync() is used to get the drop down list values of address section on the entity popup
        .......................................................................................................
        */
        [HttpGet("GetDropDownData")]
        public async Task<IActionResult> GetDropDownDataAsync(string type, int? province_id, int? country_id, int? city_id)
        {
            JsonResult js = new JsonResult();
            try
            {
                var result = await _adminConfigurationService.GetCommunicationdata(type, province_id, country_id, city_id);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = type + " data not found";
                    js.data = null;
                    return BadRequest(js);
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
        /*  
        .......................................................................................................
        * This is the GetAddressData GET API
        * @param contact_type_id is used to get lookup value id as a request header       
        * GetAddressDataAsync() is used to get the address data on the entity popup
        .......................................................................................................
        */
        [HttpGet("GetAddressData")]
        public async Task<IActionResult> GetAddressDataAsync(int contact_type_id)
        {
            JsonResult js = new JsonResult();
            try
            {
                var result = await _adminConfigurationService.GetAddressData(contact_type_id);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Address not found";
                    js.data = null;
                    return BadRequest(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Address data  found";
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
        /*  
        .......................................................................................................
        * This is the AddEditAddressData POST API
        * @param address is used to get address data in JSON format as a request body      
        * AddEditAddressDataAsync() is used to add or edit the address data on the entity popup
        .......................................................................................................
        */
        [HttpPost("AddEditAddressData")]
        public async Task<IActionResult> AddEditAddressDataAsync(AddressData address)
        {
            JsonResult js = new JsonResult();
            try
            {
                var result = await _adminConfigurationService.AddEditAddressData(address);
                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Internal server error!";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Data saved successfully.";
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
        /*  
        .......................................................................................................
        * This is the GetEmailData POST API
        * @param email is used to get the email data in JSON format as a request body      
        * GetEmailDataAsync() is used to retrieve the email data on the entity popup
        .......................................................................................................
        */
        [HttpPost("GetEmailData")]
        public async Task<IActionResult> GetEmailDataAsync(EmailData email)
        {
            JsonResult js = new JsonResult();
            try
            {
                var result = await _adminConfigurationService.GetEmailData(email);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Email data not found";
                    js.data = null;
                    return BadRequest(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Email data  found";
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
        /*  
        .......................................................................................................
        * This is the AddEditEmailData POST API
        * @param lookup is used to get the email data in JSON format as a request body      
        * AddEditEmailDataAsync() is used to add or edit the email data on the entity popup
        .......................................................................................................
        */
        [HttpPost("AddEditEmailData")]
        public async Task<IActionResult> AddEditEmailDataAsync([FromForm] EmailListdata lookup)
        {
            JsonResult js = new JsonResult();
            try
            {
                if (!ModelState.IsValid)
                {
                    List<string> ValidationMessages;

                    ValidationMessages = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage).ToList();
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some Error occured";
                    js.data = ValidationMessages;
                    return BadRequest(js);

                }
                var result = await _adminConfigurationService.AddEditEmail(lookup.EmailData);
                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some error occured";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Data saved successfully.";
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
        /*  
       .......................................................................................................
       * This is the GetContactData POST API
       * @param contact is used to get the contact data in JSON format as a request body      
       * GetContactDataAsync() is used to retrieve the contact data on the entity popup
       .......................................................................................................
       */
        [HttpPost("GetContactData")]
        public async Task<IActionResult> GetContactDataAsync(ContactData contact)
        {
            JsonResult js = new JsonResult();
            try
            {
                var result = await _adminConfigurationService.GetContactData(contact);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Contact data not found";
                    js.data = null;
                    return BadRequest(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Contact data  found";
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
        /*  
        .......................................................................................................
        * This is the AddEditContactData POST API
        * @param lookup is used to get the contact data in JSON format as a request body      
        * AddEditContactDataAsync() is used to add or edit the contact data on the entity popup
        .......................................................................................................
        */
        [HttpPost("AddEditContactData")]
        public async Task<IActionResult> AddEditContactDataAsync([FromForm] ContactListdata lookup)
        {
            JsonResult js = new JsonResult();
            try
            {
                if (!ModelState.IsValid)
                {
                    List<string> ValidationMessages;

                    ValidationMessages = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage).ToList();
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some Error occured";
                    js.data = ValidationMessages;
                    return BadRequest(js);

                }

                var result = await _adminConfigurationService.AddEditCotact(lookup.ContactData);
                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some error occured";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Data saved successfully.";
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
        #endregion
        #region Tax Period
        /*  
        .......................................................................................................
        * This is the GetTaxPeriodData GET API
        * @param PageNumber is used to get the page number
        * @param Size is used to get the page size
        * GetTaxPeriodData() is used to retrieve the tax period data
        .......................................................................................................
        */
        [HttpGet("GetTaxPeriodData")]
        public async Task<IActionResult> GetTaxPeriodData(int PageNumber, int Size)
        {
            JsonResult js = new JsonResult();
            try
            {
                var result = await _adminConfigurationService.GetTaxPeriodData(PageNumber, Size);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Tax period data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Tax period data  found";
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
        /*  
        .......................................................................................................
        * This is the AddEditTaxPeriodData POST API      
        * @param taxPeriodDto is used to get the JSON object as method body
        * AddEditTaxPeriodData() is used to store the tax period data
        .......................................................................................................
        */
        [HttpPost("AddEditTaxPeriodData")]
        public async Task<IActionResult> AddEditTaxPeriodData(TaxPeriodDto taxPeriodDto)
        {
            JsonResult js = new JsonResult();
            var operation = taxPeriodDto.TaxPeriodId > 0 ? " update" : " save";
            try
            {
                int result = await _adminConfigurationService.AddEditTaxPeriodData(taxPeriodDto);
                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Tax period data already exists.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Tax period data" + operation + "d" + "successfully.";
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
        /*  
        .......................................................................................................
        * This is the SaveTaxPeriodData POST API
        * @param PageNumber is used to get the page number
        * @param Size is used to get the page size
        * @param taxPeriodDto is used to get the JSON object as method body
        * SaveTaxPeriodData() is used to store the tax period data
        .......................................................................................................
        */
        [HttpPost("SaveTaxPeriodData")]
        public async Task<IActionResult> SaveTaxPeriodData(TaxPeriodDto taxPeriodDto)
        {
            JsonResult js = new JsonResult();            
            try
            {
                int result = await _adminConfigurationService.SaveTaxPeriodData(taxPeriodDto);
                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Failed to save the tax period changes.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Changes for the tax period saved successfully.";
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
        #endregion
    }
}
