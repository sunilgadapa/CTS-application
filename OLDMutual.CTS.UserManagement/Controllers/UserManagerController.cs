using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OLDMutual.CTS.UserManagement.Domain.Models;
using OLDMutual.CTS.UserManagement.Domain.Validators;
using OLDMutual.CTS.UserManagement.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace OLDMutual.CTS.UserManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserManagerController : ControllerBase
    {
        private readonly IUserManagementService _userManagementService;
        public UserManagerController(IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
        }
        /*  
       .......................................................................................................
       * This is the AddEditUser API
       * @param user is used to get user specific JSON body
       * AddEditUser() is used to add or update the user
       .......................................................................................................
       */
        [HttpPost("AddEditUser")]
        public async Task<IActionResult> AddEditUser([FromBody] UserManagementDto user)
        {
            JsonResult js = new JsonResult();
            try
            {
                UserManagementDtoValidator _validator = new UserManagementDtoValidator();
                var res = _validator.Validate(user);
                if (!res.IsValid)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Please select all mandatory fields";
                    js.data = null;
                    return BadRequest(js);
                }
                var result = await _userManagementService.AddEditUser(user);
                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NoContent;
                    js.Message = "User not added/updated";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    var message = (string.IsNullOrEmpty(user.UserId) || user.UserId == "0") ? "User added successfully." : "User updated successfully.";
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = message;
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
        /*  
       .......................................................................................................
       * This is the DeleteUser API
       * @param deleteUserDto is used to get user specific JSON body
       * DeleteUser() is used to delete the onboarded user
       .......................................................................................................
       */
        [HttpPost("DeleteUsers")]
        public async Task<IActionResult> DeleteUser(DeleteUserDto deleteUserDto)
        {
            JsonResult js = new JsonResult();
            try
            {
                DeleteUserDtoValidator _validator = new DeleteUserDtoValidator();
                var res = _validator.Validate(deleteUserDto);
                if (!res.IsValid)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some Error occured";
                    js.data = null;
                    return NotFound(js);

                }
                else
                {
                    var result = await _userManagementService.DeleteUser(deleteUserDto);
                    if (result >= 0)
                    {
                        js.Statuscode = (int)HttpStatusCode.OK;
                        js.Message = "Selected user deleted successfully";
                        js.data = null;
                        return Ok(js);
                    }
                    else
                    {
                        js.Statuscode = (int)HttpStatusCode.NotFound;
                        js.Message = "Selected user not deleted";
                        js.data = null;
                        return NotFound(js);
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
        /*  
      .......................................................................................................
      * This is the GetUsers API
      * @param user is used to get JSON body with filter conditions
      * GetUsers() is used to get all users based on the filter criteria
      .......................................................................................................
      */
        [HttpPost("GetUsers")]
        public async Task<IActionResult> GetUsers([FromBody] SearchUsersDto user)
        {
            JsonResult js = new JsonResult();
            try
            {
                SearchUsersDtoValidator _validator = new SearchUsersDtoValidator();
                var res = _validator.Validate(user);
                if (!res.IsValid)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Invalid request";
                    js.data = null;
                    return BadRequest(js);
                }
                var users = await _userManagementService.GetUsers(user);
                if (users == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "User data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "User data found";
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
        * This is the DoesUserExist API
        * @param user is used to get JSON body with user data
        * DoesUserExist() is used to check user exist in AD or not
        .......................................................................................................
        */
        [HttpPost("DoesUserExist")]
        public IActionResult DoesUserExist([FromBody] UserExist user)
        {
            JsonResult js = new JsonResult();
            try
            {
                UserExistValidator _validator = new UserExistValidator();
                var res = _validator.Validate(user);
                if (!res.IsValid)
                {
                    js.Statuscode = (int)HttpStatusCode.BadRequest;
                    js.Message = "Invalid request";
                    js.data = null;
                    return BadRequest(js);
                }
                if (_userManagementService.DoesUserExist(user.UserName))
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "User Found";
                    js.data = null;
                    return Ok(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "User Not Found";
                    js.data = null;
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
        /*  
        .......................................................................................................
        * This is the GetEntitiesByRole API
        * @param addUser is used to get JSON body with user data
        * GetEntitiesByRole() is used to get entities by user role
        .......................................................................................................
        */
        [HttpPost("GetEntitiesByRole")]
        public async Task<IActionResult> GetEntitiesByRole(AddUser addUser)
        {
            JsonResult js = new JsonResult();
            try
            {
                var result = await _userManagementService.GetEntitiesByRole(addUser);
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "No roles data found";
                    js.data = null;
                    return NotFound(js);

                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Roles data found";
                    js.data = result;
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
        * This is the GetAllRoles API        
        * GetAllRoles() is used to get all roles
        .......................................................................................................
        */
        [HttpGet("GetAllRoles")]
        public async Task<IActionResult> GetAllRoles()
        {
            JsonResult js = new JsonResult();
            try
            {
                var result = await _userManagementService.GetAllRoles();
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "No roles data found";
                    js.data = null;
                    return NotFound(js);

                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Roles data found";
                    js.data = result;
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
