using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.Identity.Data.Interfaces;
using OLDMutual.CTS.Identity.Domain.Models;
using OLDMutual.CTS.Identity.Service.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Identity.Service.Services
{
    public class AccountManagerService:IAccountManagerService
    {
        private readonly IAccountManager _accountManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AccountManagerService(IAccountManager accountManager, IHttpContextAccessor httpContextAccessor)
        {
            _accountManager = accountManager;
            _httpContextAccessor = httpContextAccessor;
        }
        /*  
        .......................................................................................................
        * This is the IsValidAzureActiveDirectoryUser function
        * IsValidAzureActiveDirectoryUser is used to check wheather the user is present in AD or not
        .......................................................................................................
        */
        public async Task<UserLogin> IsValidAzureActiveDirectoryUser()
        {
           
                var eMail = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
                return await _accountManager.IsValidAzureActiveDirectoryUser(eMail);                              
           
          
        }
    }
}
