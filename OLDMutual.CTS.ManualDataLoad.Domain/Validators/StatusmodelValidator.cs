using FluentValidation;
using OLDMutual.CTS.ManualDataLoad.Domain.Models;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Validators
{
    public class StatusmodelValidator : AbstractValidator<SignOffDto>
    {
        public StatusmodelValidator()
        {
            RuleFor(x => x.status).NotEmpty().NotNull().WithMessage("Please pass file status.");
            RuleFor(x => x.file_id).NotEmpty().NotNull().WithMessage("Please select file.");
            RuleFor(x => x.document_type_id).NotEmpty().NotNull().WithMessage("Please select document type id.");
        }
    }
}
