using OLDMutual.CTS.Identity.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Identity.Service.Interfaces
{
    public interface IAccountManagerService
    {
        public Task<UserLogin> IsValidAzureActiveDirectoryUser();
    }
}
