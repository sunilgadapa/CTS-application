using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OLDMutual.CTS.Identity.Domain.Models;
using OLDMutual.CTS.Identity.Service.Interfaces;
using System;
using System.Net;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Identity.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MenuController : ControllerBase
    {
        private readonly ISideDrawerMenuService _sideDrawerMenuService;
        public MenuController(ISideDrawerMenuService sideDrawerMenuService)
        {
            _sideDrawerMenuService = sideDrawerMenuService;
        }
        [HttpGet("Menu")]
/*  
.......................................................................................................
* This is the Menu API

* Menu is used to get menu list for selected user
.......................................................................................................
*/
        public async Task<IActionResult> Menu()
        {
            JsonResult js = new JsonResult();
            try
            {
                Menu menu;
                menu = await Task.FromResult(_sideDrawerMenuService.GetSideBarMenuList());
                if (menu.user_id != 0)
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.data = menu;
                    return Ok(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.data = null;
                    js.Message = "For this user role not mapped!!";
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
