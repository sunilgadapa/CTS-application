using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OLDMutual.CTS.Admin;
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
    public class MessagEventController : Controller
    {
        private readonly IMessagingEventService _messagingEventServiceService;
        private readonly IAdminConfigurationService _adminConfigurationService;
        public MessagEventController(IMessagingEventService messagingEventServiceService, IAdminConfigurationService adminConfigurationService)
        {
            _messagingEventServiceService = messagingEventServiceService;
            _adminConfigurationService = adminConfigurationService;
        }
        #region MessageEvent
        /*  
        .......................................................................................................
        * This is the GetMessageEvent POST API
        * @param message is used to get the Messaging Event data in JSON format as a request body      
        * GetMessageEventAsync() is used to get the messaging events specific to the tax type
        .......................................................................................................
        */
        [HttpPost("GetMessageEvent")]
        public async Task<IActionResult> GetMessageEventAsync(MessageEvents message)
        {
            JsonResult js = new JsonResult();
            try
            {
                var messages = await _messagingEventServiceService.GetMessageEvent(message);
                if (!messages.Any())
                {
                    string val = await _adminConfigurationService.TaxModuleName(message.tax_module_id);
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = (val != "") ? val + " Tax module regarding Message event data not found" : "Message Event Not Found";
                    js.data = null;
                    return BadRequest(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Message event data  found";
                    js.data = messages;
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
        * This is the AddEditMessageEvent POST API
        * @param message is used to get the Messaging Event data in JSON format as a request body      
        * AddEditMessageEventAsync() is used to add or edit the messagin event for selected tax type
        .......................................................................................................
        */
        [HttpPost("AddEditMessageEvent")]
        public async Task<IActionResult> AddEditMessageEventAsync(MessageEvents message)
        {
            JsonResult js = new JsonResult();
            try
            {
                MessageEventDataValidator _validator = new MessageEventDataValidator();
                var res = _validator.Validate(message);
                if (!res.IsValid)
                {
                    List<string> ValidationMessages = new List<string>();
                    foreach (ValidationFailure failure in res.Errors)
                    {
                        ValidationMessages.Add(failure.PropertyName + ": " + failure.ErrorMessage);
                    }
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some Error occured";
                    js.data = ValidationMessages;
                    return BadRequest(js);
                }
                else
                {
                    var lookupvaluedata = await _messagingEventServiceService.AddEditMessageeventdata(message);
                    if (lookupvaluedata == 0)
                    {
                        js.Statuscode = (int)HttpStatusCode.BadRequest;
                        js.Message = "Some error occured or Same name data found.";
                        js.data = null;
                        return BadRequest(js);
                    }
                    else if (lookupvaluedata == -1)
                    {
                        js.Statuscode = (int)HttpStatusCode.BadRequest;
                        js.Message = message.messaging_event + " data already exist.";
                        js.data = null;
                        return BadRequest(js);
                    }
                    else
                    {
                        js.Statuscode = (int)HttpStatusCode.OK;
                        string messageval = (message.messaging_event_id > 0) ? "updated" : "added";
                        js.Message = "Messaging event " + messageval + " successfully.";
                        js.data = lookupvaluedata;
                        return Ok(js);
                    }
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
       * This is the SaveMessageEvent POST API
       * @param ids is used to get the Messaging Event ids in a JSON format as a request body      
       * SaveMessageEvent() is used to active/inactive the selected event ids
       .......................................................................................................
       */
        [HttpPost("SaveMessageEvent")]
        public async Task<IActionResult> SaveMessageEvent(SaveMessagEvent ids)
        {
            JsonResult js = new JsonResult();
            try
            {
                SaveMEventDtoValidator _validator = new SaveMEventDtoValidator();
                var res = _validator.Validate(ids);
                if (!res.IsValid)
                {
                    List<string> ValidationMessages = new List<string>();
                    foreach (ValidationFailure failure in res.Errors)
                    {
                        ValidationMessages.Add(failure.PropertyName + ": " + failure.ErrorMessage);
                    }
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some Error occured";
                    js.data = ValidationMessages;
                    return BadRequest(js);
                }
                else
                {
                    var result = await _messagingEventServiceService.SaveMessageEvent(ids);
                    if (result == 0)
                    {
                        js.Statuscode = (int)HttpStatusCode.NotFound;
                        js.Message = "Selected message event not found";
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
