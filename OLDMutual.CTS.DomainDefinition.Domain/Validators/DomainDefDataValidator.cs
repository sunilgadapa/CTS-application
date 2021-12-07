using FluentValidation;
using OLDMutual.CTS.DomainDefinition.Domain.Models;

namespace OLDMutual.CTS.DomainDefinition.Domain.Validators
{
    public class DomainDefDataValidator : AbstractValidator<DomainDefData>
    {
        public DomainDefDataValidator()
        {
            RuleFor(x => x.lookup_type).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Domain name be not empty. NEVER!");
            RuleFor(x => x.lookup_value_alias).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Domain alias should be not empty. NEVER!");
        }
    }
}
