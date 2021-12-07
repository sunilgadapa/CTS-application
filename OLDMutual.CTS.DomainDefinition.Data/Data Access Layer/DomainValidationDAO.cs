using Dapper;
using Microsoft.AspNetCore.Http;
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
    public class DomainValidationDao : IDomainValidation
    {
        private readonly IDapper _dapper;

        public DomainValidationDao(IDapper dapper)
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
        /*  
        .......................................................................................................
        * This is the GetValidationType DAO method
        * @param validationType is used to get type of validation
        * GetValidationType() is used to get validation rule for specific validation type
        .......................................................................................................
        */
        public async Task<IEnumerable<DomainValidationDto>> GetValidationType(string validationType)
        {
            DynamicParameters param = new DynamicParameters();
            param.Add("@validationType", validationType);
            string sp = "SP_GetValidationTypeDropdown";
            var result = await Task.FromResult(_dapper.GetAll<DomainValidationDto>(sp, param, commandType: CommandType.StoredProcedure));
            return result;
        }

        /*  
        .......................................................................................................
        * This is the GetValidationRule DAO method
        * @param lookup_value_id is used to get lookup value specific validation rules
        * GetValidationRule() is used to get validation rules for specific lookup value
        .......................................................................................................
        */
        public async Task<IEnumerable<DomainValidationDto>> GetValidationRule(int lookup_value_id)
        {

            DynamicParameters param = new DynamicParameters();
            param.Add("@lookup_value_id", lookup_value_id);
            string sp = "SP_GetValidationRule";
            var result = await Task.FromResult(_dapper.GetAll<DomainValidationDto>(sp, param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
       .......................................................................................................
       * This is the SaveValidationRule API
       * @param domainValidationDto is used to get domain valiadation
       * @param eMail is to get the user name for the current operation
       * SaveValidationRule() is used to save validation rules for specific lookup value
       .......................................................................................................
       */
        public async Task<int> SaveValidationRule(DomainValidationDto domainValidationDto, string eMail)
        {
            int result = 0;
            string sp = "SP_SaveValidationRule";
            DynamicParameters param = new DynamicParameters();
            param.Add("@lookup_value_id", domainValidationDto.LookupValueId);
            param.Add("@min_length", domainValidationDto.MinLength);
            param.Add("@max_length", domainValidationDto.MaxLength);
            param.Add("@pattern_id", domainValidationDto.PatternId);
            param.Add("@validation_lookup_type_id", domainValidationDto.LookupTypeId);
            param.Add("@user_email", eMail);
            param.Add("@rows_affected", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(sp, "@rows_affected", param, commandType: CommandType.StoredProcedure));
            return result;

        }
    }
}
