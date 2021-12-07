using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;
using OLDMutual.CTS.Identity.Service.Interfaces;
using System;
using System.Net;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Identity.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IAccountManagerService _accountManagerService;

        public UserController(IAccountManagerService accountManagerService)
        {
            _accountManagerService = accountManagerService;
        }

        [HttpPost("Onboard")]
        /*  
       .......................................................................................................
       * This is the Onboard API

       * Onboard is used to check weather the user is onboarded or not
       .......................................................................................................
       */
        public async Task<IActionResult> Onboard()
        {
            JsonResult js = new JsonResult();
            try
            {
                var signinResult = await _accountManagerService.IsValidAzureActiveDirectoryUser();
                if (signinResult.Onboarded)
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "User Onboarded";
                    js.data = signinResult;
                    return Ok(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "User is not onboarded";
                    js.data = signinResult;
                    return NotFound(js);
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
