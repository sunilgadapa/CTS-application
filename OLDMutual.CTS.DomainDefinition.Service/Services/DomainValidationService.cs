using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.DomainDefinition.Data.Interfaces;
using OLDMutual.CTS.DomainDefinition.Domain.Models;
using OLDMutual.CTS.DomainDefinition.Service.Interfaces;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OLDMutual.CTS.DomainDefinition.Service.Services
{
    public class DomainValidationService : IDomainValidationService
    {
        private readonly IDomainValidation _domainValidation;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DomainValidationService(IDomainValidation domainValidation, IHttpContextAccessor httpContextAccessor)
        {
            _domainValidation = domainValidation;
            _httpContextAccessor = httpContextAccessor;
        }

        /*  
        .......................................................................................................
        * This is the GetValidationType service method
        * @param validationType is used to get type of validation
        * GetValidationType() is used to get validation rule for specific validation type
        .......................................................................................................
        */
        public async Task<IEnumerable<DomainValidationDto>> GetValidationType(string validationType)
        {
            return await _domainValidation.GetValidationType(validationType);
        }
        /*  
        .......................................................................................................
        * This is the GetValidationRule service method
        * @param lookup_value_id is used to get lookup value specific validation rules
        * GetValidationRule() is used to get validation rules for specific lookup value
        .......................................................................................................
        */
        public async Task<IEnumerable<DomainValidationDto>> GetValidationRule(int lookup_value_id)
        {
            return await _domainValidation.GetValidationRule(lookup_value_id);           
        }

        /*  
       .......................................................................................................
       * This is the SaveValidationRule service method
       * @param domainValidationDto is used to get domain valiadation
       * SaveValidationRule() is used to save validation rules for specific lookup value
       .......................................................................................................
       */
        public async Task<int> SaveValidationRule(DomainValidationDto domainValidationDto)
        {
            var eMail = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
            return await _domainValidation.SaveValidationRule(domainValidationDto, eMail);
        }
    }
}
