using FluentValidation;
using OLDMutual.CTS.ManualDataLoad.Domain.Models;
using System.Collections.Generic;

namespace OLDMutual.CTS.ManualDataLoad.Domain.Validators
{
    public class FileModelValidator : AbstractValidator<List<FileModel>>
    {
        public FileModelValidator()
        {
            RuleFor(x => x.Count).NotEmpty().NotNull().WithMessage("Ids should be not empty or null.");
        }
    }
}
