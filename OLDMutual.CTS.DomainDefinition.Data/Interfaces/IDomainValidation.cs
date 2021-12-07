using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.DomainDefinition.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OLDMutual.CTS.DomainDefinition.Data.Interfaces
{
    public interface IDomainValidation:IDisposable
    {
        Task<IEnumerable<DomainValidationDto>> GetValidationType(string validationType);
        Task<IEnumerable<DomainValidationDto>> GetValidationRule(int lookup_value_id);
        Task<int> SaveValidationRule(DomainValidationDto domainValidationDto, string eMail);
    }
}
