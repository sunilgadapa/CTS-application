using Dapper;
using OLDMutual.CTS.DomainDefinition.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.DomainDefinition.Data.Interfaces;
using OLDMutual.CTS.DomainDefinition.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.DomainDefinition.Data.Data_Access_Layer
{
    public class DomainDefinitionDao : IDomainDefinition
    {
        private readonly IDapper _dapper;
        public DomainDefinitionDao(IDapper dapper)
        {
            _dapper = dapper;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            // Cleanup
        }
        #region Domain Definition

        /*  
       .......................................................................................................
      * This is the AddEditDomainDefinition DAO method
      * @param domainDef is used to get Domain specific JSON body
      * @param username is to get the user name for the current operation
      * AddEditDomainDefinition() is used to add or update the domain defination
      .......................................................................................................
      */
        public async Task<int> AddEditDomainDefinition(DomainDefData domainDef, string username)
        {
            int result = 0;
            string sp = "SP_DomainDefination";
            DynamicParameters param = new DynamicParameters();
            param.Add("@lookup_type_id", domainDef.lookup_type_id);
            param.Add("@lookup_type", domainDef.lookup_type);
            param.Add("@lookup_name", domainDef.lookup_name);
            param.Add("@lookup_desc", domainDef.lookup_type_description);
            param.Add("@lookup_alias", domainDef.lookup_value_alias);
            param.Add("@submission_domain_flag", domainDef.submission_domain_flag);
            param.Add("@username", username);
            param.Add("@validation_flag", domainDef.validation_flag);
            param.Add("@ACTION", (domainDef.lookup_type_id > 0) ? "U" : "I");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /// <summary>
        /// Get domain ref data
        /// </summary>
        /// <param name="domaind"></param>
        /// <returns>tuple</returns>
        /// 
        /*  
        .......................................................................................................
       * This is the GetDomainDefinition DAO method
       * @param domainDef is used to get Domain specific JSON body
       * GetDomainDefinition() is used to get a domain defination
       .......................................................................................................
       */
        public async Task<Tuple<IEnumerable<DomainDefData>, int, int>> GetDomainDefinition(DomainDefData domaind)
        {
            string sp = "SP_DomainDefination";
            DynamicParameters param = new DynamicParameters();
            param.Add("@lookup_type", domaind.lookup_type);
            param.Add("@Page", domaind.Page);
            param.Add("@Size", domaind.Size);
            param.Add("@searchtext", domaind.searchtext);
            param.Add("@ACTION", "G");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            param.Add("@RowSelectedCount", DbType.Int32, direction: ParameterDirection.Output);
            var result = await Task.FromResult(_dapper.GetAll<DomainDefData>(sp, param, commandType: CommandType.StoredProcedure));
            return Tuple.Create(result, param.Get<int>("@RowsAffected"), param.Get<int>("@RowSelectedCount"));

        }
        /// <summary>
        /// SaveDomainDefinition
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="page"></param>
        /// <param name="size"></param>
        /// <param name="username"></param>
        /// <param name="lookup_type"></param>
        /// <returns>0 or 1</returns>
        /// 

        /*  
         .......................................................................................................
        * This is the SaveDomainDefinition DAO method
        * @param lookup_type is used to get Domain specific look up type
        * @param size is used to get size of records
        * @param page is used to get page no of grid 
        * @param DataTable is used to get DT
        * @param username is to get the user name for the current operation
        * SaveDomainDefinition() is used to save (active/deactive) a domain defination
        .......................................................................................................
        */
        public async Task<int> SaveDomainDefinition(DataTable dt, int page, int size, string username, string lookup_type)
        {
            int result = 0;
            string sp = "SP_DomainDefination";
            DynamicParameters param = new DynamicParameters();
            param.Add("@dtlookupTosave", dt.AsTableValuedParameter());
            param.Add("@lookup_type", lookup_type);
            param.Add("@ACTION", "S");
            param.Add("@Page", page);
            param.Add("@Size", size);
            param.Add("@username", username);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;

        }
        #endregion
        #region Domain Reference 
        /*  
       .......................................................................................................
      * This is the AddEditDomainReference DAO method
      * @param domainRef is used to get Domain reference specific JSON body
      * @param username is to get the user name for the current operation
      * AddEditDomainReference() is used to add or update the domain reference
      .......................................................................................................
      */
        public async Task<int> AddEditDomainReference(DataTable dt, DomainRefData domainDef, string username)
        {
            int result = 0;
            string sp = "SP_DomainReference";
            DynamicParameters param = new DynamicParameters();
            param.Add("@lookup_type_id", domainDef.lookup_type_id);
            param.Add("@lookup_value", domainDef.lookup_value_name);
            param.Add("@lookup_alias", domainDef.lookup_value_alias);
            param.Add("@lookup_desc", domainDef.lookup_value_description);
            param.Add("@lookup_value_id", domainDef.lookup_value_id);
            param.Add("@SARS_mapping_code", domainDef.SARS_mapping_code);
            param.Add("@tax_module_id", dt.AsTableValuedParameter());
            param.Add("@username", username);
            param.Add("@ACTION", (domainDef.lookup_value_id > 0) ? "U" : "I");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
    .......................................................................................................
   * This is the GetDomainReference DAO method
   * @param domainRef is used to get Domain specific JSON body
   * GetDomainReference() is used to get a domain reference
   .......................................................................................................
   */
        public async Task<Tuple<IEnumerable<DomainRefData>, int, int>> GetDomainReference(DomainRefData domaind)
        {
            string sp = "SP_DomainReference";
            DynamicParameters param = new DynamicParameters();
            param.Add("lookup_type_id", domaind.lookup_type_id);
            param.Add("@Page", domaind.Page);
            param.Add("@Size", domaind.Size);
            param.Add("@searchtext", domaind.searchtext);
            param.Add("@ACTION", "G");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            param.Add("@RowSelectedCount", DbType.Int32, direction: ParameterDirection.Output);
            var result = await Task.FromResult(_dapper.GetAll<DomainRefData>(sp, param, commandType: CommandType.StoredProcedure));
            return Tuple.Create(result, param.Get<int>("@RowsAffected"), param.Get<int>("@RowSelectedCount"));

        }

        /*  
       .......................................................................................................
      * This is the SaveDomainReference DAO method
      * @param ids is used to get Domain reference specific ids
      * @param lookup_type_id is used to get Domain reference specific look up type
      * @param size is used to get size of records
      * @param page is used to get page no of grid 
      * @param DataTable is used to get DT
      * @param username is to get the user name for the current operation
      * SaveDomainReference() is used to save (active/deactive) a domain reference
      .......................................................................................................
      */
        public async Task<int> SaveDomainReference(DataTable dt, int page, int size, string lookup_type_id, string username)
        {
            int result = 0;
            string sp = "SP_DomainReference";
            DynamicParameters param = new DynamicParameters();
            param.Add("@dtlookuptaxTosave", dt.AsTableValuedParameter());
            param.Add("@ACTION", "S");
            param.Add("@username", username);
            param.Add("@Page", page);
            param.Add("@Size", size);
            param.Add("@lookup_type_id", lookup_type_id);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }
        #endregion
    }
}
