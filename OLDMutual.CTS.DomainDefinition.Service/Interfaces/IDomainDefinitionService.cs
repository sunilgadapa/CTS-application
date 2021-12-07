using OLDMutual.CTS.DomainDefinition.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.DomainDefinition.Service.Interfaces
{
    public interface IDomainDefinitionService
    {
        Task<int> AddEditDomainDefinition(DomainDefData domainDef);
        Task<int> AddEditDomainReference(DomainRefData domainDef);             
        Task<IEnumerable<DomainRefData>> GetDomainReference(DomainRefData domaind);
        Task<IEnumerable<DomainDefData>> GetDomainDefination(DomainDefData domaind);
        Task<int> SaveDomainDefinition(SaveLookup ids);
        Task<int> SaveDomainReference(SaveLookup ids);
    }
}
