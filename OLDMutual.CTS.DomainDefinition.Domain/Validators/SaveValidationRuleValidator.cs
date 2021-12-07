using FluentValidation;
using OLDMutual.CTS.DomainDefinition.Domain.Models;

namespace OLDMutual.CTS.DomainDefinition.Domain.Validators
{
    public class SaveValidationRuleValidator : AbstractValidator<DomainValidationDto>
    {
        public SaveValidationRuleValidator()
        {
            RuleFor(x => x.LookupValueId).NotEmpty().NotNull().WithMessage("LookupValueId should be not empty or null.");          
        }
    }
}
