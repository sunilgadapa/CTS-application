using FluentValidation;
using OLDMutual.CTS.DomainDefinition.Domain.Models;

namespace OLDMutual.CTS.DomainDefinition.Domain.Validators
{
    public class SavelookuptaxdataValidator : AbstractValidator<Savelookuptaxdata>
    {
        public SavelookuptaxdataValidator()
        {
            RuleForEach(x => x.taxdata).SetValidator(new SaveLookuptaxDtoValidator());

        }
    }
}
