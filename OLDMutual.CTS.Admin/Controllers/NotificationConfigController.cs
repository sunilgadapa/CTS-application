using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OLDMutual.CTS.Admin.Domain.Models;
using OLDMutual.CTS.Admin.Domain.Validators;
using OLDMutual.CTS.Admin.Service.Interfaces;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;


namespace OLDMutual.CTS.Admin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationConfigController : ControllerBase
    {
        private readonly INotificationConfigurationService _notificationConfigurationService;

        public NotificationConfigController(INotificationConfigurationService notificationConfigurationService)
        {
            _notificationConfigurationService = notificationConfigurationService;
        }
        /*  
       .......................................................................................................
       * This is the GetUsers GET API          
       * GetUsers() is used to get all user available in the system
       .......................................................................................................
       */
        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers()
        {
            JsonResult js = new JsonResult();
            try
            {
                var users = await _notificationConfigurationService.GetUsers();
                if (users == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Users not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Users found";
                    js.data = users;
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
        /*  
        .......................................................................................................
        * This is the GetUsers POST API          
        * @param data is used to get the filter data in JSON format as a request body  
        * GetUsers() is used to get users available in the system for selected tax type and messaging event
        .......................................................................................................
        */

        [HttpPost("GetUsers")]
        public async Task<IActionResult> GetUsers([FromBody] NotificationConfigDto data)
        {
            JsonResult js = new JsonResult();
            try
            {
                NotificationConfigDtoValidator _validator = new NotificationConfigDtoValidator();
                var res = _validator.Validate(data);
                if (!res.IsValid)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Invalid request";
                    js.data = null;
                    return BadRequest(js);
                }
                var users = await _notificationConfigurationService.GetUsers(data);
                if (users == null)
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
                    js.data = users;
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
        /*  
        .......................................................................................................
        * This is the AddRoleOrUser POST API          
        * @param data is used to get the data in JSON format as a request body  
        * AddRoleOrUser() is used to add users or roles for selected tax type and messaging event
        .......................................................................................................
        */
        [HttpPost("AddRoleOrUser")]
        public async Task<IActionResult> AddRoleAndUser([FromBody] NotificationConfigDto data)
        {
            JsonResult js = new JsonResult();
            try
            {
                AddRoleAndUserValidator _validator = new AddRoleAndUserValidator();
                var res = _validator.Validate(data);
                if (!res.IsValid)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Invalid request";
                    js.data = null;
                    return BadRequest(js);
                }
                int users = await _notificationConfigurationService.AddRoleAndUser(data);
                if (users == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = data.EntityToAdd + " already assigned.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = data.EntityToAdd + " added successfully.";
                    js.data = users;
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
        /*  
       .......................................................................................................
       * This is the SaveChanges POST API          
       * @param data is used to get the data in JSON format as a request body  
       * SaveChanges() is used to active/inactive the users or roles for selected tax type and messaging event
       .......................................................................................................
       */
        [HttpPost("SaveChanges")]
        public async Task<IActionResult> SaveChanges([FromBody] NotificationConfigDto data)
        {
            JsonResult js = new JsonResult();
            try
            {
                int users = await _notificationConfigurationService.SaveChanges(data);
                if (users == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Changes are not saved.";
                    js.data = users;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Changes saved successfully.";
                    js.data = users;
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
        /*  
        .......................................................................................................
        * This is the SaveTemplate POST API          
        * @param data is used to get the data in JSON format as a request body  
        * SaveTemplate() is used to add the template for selected notification type, tax type and messaging event
        .......................................................................................................
        */
        [HttpPost("SaveTemplate")]
        public async Task<IActionResult> SaveTemplate([FromBody] NotificationTemplateDto data)
        {
            JsonResult js = new JsonResult();
            try
            {
                SaveTemplateValidator _validator = new SaveTemplateValidator();
                var res = _validator.Validate(data);
                if (!res.IsValid)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Invalid request";
                    js.data = null;
                    return BadRequest(js);
                }
                int users = await _notificationConfigurationService.SaveNotificationTemplate(data);
                if (users == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Template not stored";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Data saved successfully.";
                    js.data = users;
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
        /*  
        .......................................................................................................
        * This is the GetTemplate POST API          
        * @param data is used to get the data in JSON format as a request body  
        * GetTemplate() is used to get the template for selected notification type, tax type and messaging event
        .......................................................................................................
        */
        [HttpPost("GetTemplate")]
        public async Task<IActionResult> GetTemplate([FromBody] NotificationTemplateDto data)
        {
            JsonResult js = new JsonResult();
            try
            {
                GetTemplateValidator _validator = new GetTemplateValidator();
                var res = _validator.Validate(data);
                if (!res.IsValid)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Invalid request";
                    js.data = null;
                    return BadRequest(js);
                }
                var users = await _notificationConfigurationService.GetNotificationTemplate(data);
                if (!users.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Template not found for selected type";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Template found";
                    js.data = users;
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
        /*  
        .......................................................................................................
        * This is the GetEventAssociatedTaxData GET API          
        * @param data is used to get the data in JSON format as a request body  
        * GetEventAssociatedTaxData() is used to get the events which are associated with tax types 
        .......................................................................................................
        */
        [HttpGet("GetEventAssociatedTaxData")]
        public async Task<IActionResult> GetEventAssociatedTaxData()
        {
            JsonResult js = new JsonResult();
            try
            {
                var users = await _notificationConfigurationService.GetEventAssociatedTaxData();
                if (!users.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Tax module data not found.";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Tax module data found";
                    js.data = users;
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
        /*  
        .......................................................................................................
        * This is the GetEventsByTaxIds POST API          
        * @param messageEvents is used to get the data in JSON format as a request body  
        * GetEventsByTaxIds() is used to get the events by tax types 
        .......................................................................................................
        */
        [HttpPost("GetEventsByTaxIds")]
        public async Task<IActionResult> GetEventsByTaxIds(MessageEvents messageEvents)
        {
            JsonResult js = new JsonResult();
            try
            {
                MessageEventByTaxValidator _validator = new MessageEventByTaxValidator();
                var res = _validator.Validate(messageEvents);
                if (!res.IsValid)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Invalid request";
                    js.data = null;
                    return BadRequest(js);
                }
                var users = await _notificationConfigurationService.GetEventsByTaxIds(messageEvents.tax_id);
                if (users == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Events not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Events found";
                    js.data = users;
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
    }
}
