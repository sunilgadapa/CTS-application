using OLDMutual.CTS.DomainDefinition.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.DomainDefinition.Data.Interfaces
{
    public interface IDomainDefinition : IDisposable
    {
        /// <summary>
        /// Get domain ref data
        /// </summary>
        /// <param name="domaind"></param>
        /// <returns>tuple</returns>
        Task<Tuple<IEnumerable<DomainDefData>, int, int>> GetDomainDefinition(DomainDefData domaind);
        Task<Tuple<IEnumerable<DomainRefData>, int,int>> GetDomainReference(DomainRefData domaind);

        Task<int> SaveDomainReference(DataTable dt, int page, int size, string lookup_type_id, string username);
        Task<int> AddEditDomainDefinition(DomainDefData domainDef, string username);
        Task<int> AddEditDomainReference(DataTable dt, DomainRefData domainDef, string username);
        /// <summary>
        /// SaveDomainDefinition
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="page"></param>
        /// <param name="size"></param>
        /// <param name="username"></param>
        /// <param name="lookup_type"></param>
        /// <returns>0 or 1</returns>
        Task<int> SaveDomainDefinition(DataTable dt, int page, int size, string username, string lookup_type);


    }
}
