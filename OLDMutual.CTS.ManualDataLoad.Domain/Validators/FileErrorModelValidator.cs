using FluentValidation;
using OLDMutual.CTS.ManualDataLoad.Domain.Models;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Validators
{
    public class FileErrorModelValidator : AbstractValidator<FileErrorModel>
    {
        public FileErrorModelValidator()
        {
            RuleFor(x => x.Ids).NotEmpty().NotNull().WithMessage("Please Select data.");


        }
    }
}
