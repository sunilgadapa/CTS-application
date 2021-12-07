using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.DomainDefinition.Data.Interfaces;
using OLDMutual.CTS.DomainDefinition.Domain.Models;
using OLDMutual.CTS.DomainDefinition.Service.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace OLDMutual.CTS.DomainDefinition.Service.Services
{
    public class DomainDefinitionService : IDomainDefinitionService
    {
        private readonly IDomainDefinition _domainDefinition;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public DomainDefinitionService(IDomainDefinition domainDefinition, IHttpContextAccessor httpContextAccessor)
        {
            _domainDefinition = domainDefinition;
            _httpContextAccessor = httpContextAccessor;
        }
        #region Domain Definition
        /*  
       .......................................................................................................
      * This is the AddEditDomainDefinition service method
      * @param domainDef is used to get Domain specific JSON body
      * AddEditDomainDefinition() is used to add or update the domain defination
      .......................................................................................................
      */
        public async Task<int> AddEditDomainDefinition(DomainDefData domainDef)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _domainDefinition.AddEditDomainDefinition(domainDef, userName);
        }
        /*  
        .......................................................................................................
       * This is the GetDomainDefinition service method
       * @param domainDef is used to get Domain specific JSON body
       * GetDomainDefinition() is used to get a domain defination
       .......................................................................................................
       */
        public async Task<IEnumerable<DomainDefData>> GetDomainDefination(DomainDefData domaind)
        {
            var domainDefData = await _domainDefinition.GetDomainDefinition(domaind);
            foreach (DomainDefData item in domainDefData.Item1)
            {
                item.totalrows = domainDefData.Item2;
                item.totalselectedrows = domainDefData.Item3;
            }
            return domainDefData.Item1;
        }

        /*  
         .......................................................................................................
        * This is the SaveDomainDefinition service method
        * @param ids is used to get Domain specific ids
        * SaveDomainDefinition() is used to save (active/deactive) a domain defination
        .......................................................................................................
        */
        public async Task<int> SaveDomainDefinition(SaveLookup ids)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            DataTable dt = new DataTable();
            dt.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < ids.Ids.Length; i++)
            {
                row = dt.NewRow();
                row["ID"] = ids.Ids[i];
                dt.Rows.Add(row);
            }
            return await _domainDefinition.SaveDomainDefinition(dt, ids.page, ids.size, userName,ids.lookup_type_name);
        }
        #endregion
        #region Domain Reference
        /*  
        .......................................................................................................
       * This is the AddEditDomainReference service method
       * @param domainRef is used to get Domain reference specific JSON body
       * AddEditDomainReference() is used to add or update the domain reference
       .......................................................................................................
       */
        public async Task<int> AddEditDomainReference(DomainRefData domainDef)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            DataTable dt = new DataTable();
            dt.Columns.Add("ID", typeof(int));
            DataRow row;

            if (domainDef.tax_module_id.Any())
            {
                for (int i = 0; i < domainDef.tax_module_id.Count(); i++)
                {

                    row = dt.NewRow();
                    row["ID"] = domainDef.tax_module_id[i];
                    dt.Rows.Add(row);
                }
            }
            return await _domainDefinition.AddEditDomainReference(dt, domainDef, userName);
        }

        /*  
       .......................................................................................................
      * This is the GetDomainReference service method
      * @param domainRef is used to get Domain specific JSON body
      * GetDomainReference() is used to get a domain reference
      .......................................................................................................
      */
        public async Task<IEnumerable<DomainRefData>> GetDomainReference(DomainRefData domaind)
        {
            var domainRefData = await _domainDefinition.GetDomainReference(domaind);
            foreach (DomainRefData item in domainRefData.Item1)
            {
                item.tax_module_names = item.tax_module_name==null?new string[] { } : item.tax_module_name.Split(",");
                item.totalrows = domainRefData.Item2;
                item.totalselectedrows = domainRefData.Item3;
            }
            return domainRefData.Item1;
        }

        /*  
         .......................................................................................................
        * This is the SaveDomainReference service method
        * @param ids is used to get Domain reference specific ids
        * SaveDomainReference() is used to save (active/deactive) a domain reference
        .......................................................................................................
        */
        public async Task<int> SaveDomainReference(SaveLookup ids)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            DataTable dt = new DataTable();
            dt.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < ids.Ids.Length; i++)
            {
                row = dt.NewRow();
                row["ID"] = ids.Ids[i];
                dt.Rows.Add(row);
            }
            return await _domainDefinition.SaveDomainReference(dt, ids.page, ids.size, ids.lookup_type_name, userName);
        }
        #endregion
    }
}
