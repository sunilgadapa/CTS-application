using FluentValidation;
using OLDMutual.CTS.DomainDefinition.Domain.Models;

namespace OLDMutual.CTS.DomainDefinition.Domain.Validators
{
    public class DomainRefDataValidator : AbstractValidator<DomainRefData>
    {
        public DomainRefDataValidator()
        {
            RuleFor(x => x.lookup_value_name).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Refernece code should be not empty. NEVER!");

            RuleFor(x => x.tax_module_id).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Please select tax type!");
        }
    }
}
