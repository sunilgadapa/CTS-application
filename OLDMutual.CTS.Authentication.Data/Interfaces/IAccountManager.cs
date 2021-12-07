using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.Identity.Domain.Models;
using System;
using System.Threading.Tasks;


namespace OLDMutual.CTS.Identity.Data.Interfaces
{
    public interface IAccountManager : IDisposable
    {             
        Task<UserLogin> IsValidAzureActiveDirectoryUser(string eMail);

    }
}
