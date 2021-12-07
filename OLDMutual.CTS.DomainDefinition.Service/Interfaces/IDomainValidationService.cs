using OLDMutual.CTS.DomainDefinition.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.DomainDefinition.Service.Interfaces
{
    public interface IDomainValidationService
    {
        Task<IEnumerable<DomainValidationDto>> GetValidationType(string validationType);
        Task<IEnumerable<DomainValidationDto>> GetValidationRule(int lookup_value_id);
        Task<int> SaveValidationRule(DomainValidationDto domainValidationDto);
    }
}
