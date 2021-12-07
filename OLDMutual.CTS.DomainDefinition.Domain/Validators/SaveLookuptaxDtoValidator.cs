using FluentValidation;
using OLDMutual.CTS.DomainDefinition.Domain.Models;

namespace OLDMutual.CTS.DomainDefinition.Domain.Validators
{
    public class SaveLookuptaxDtoValidator : AbstractValidator<SaveLookuptax>
    {
        public SaveLookuptaxDtoValidator()
        {
            RuleFor(x => x.Ids).NotEmpty().NotNull().WithMessage("Ids should be not empty or null.");
        }
    }
}
