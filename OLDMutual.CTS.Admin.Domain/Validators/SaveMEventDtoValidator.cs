using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class SaveMEventDtoValidator : AbstractValidator<SaveMessagEvent>
    {
        public SaveMEventDtoValidator()
        {
            RuleFor(x => x.Ids).NotEmpty().NotNull().WithMessage("Ids should be not empty or null.");
            RuleFor(x => x.tax_module_id).NotEmpty().NotNull().WithMessage("Please select Tax Module.");

        }
    }
}
