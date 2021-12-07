using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class LookupDataValidator : AbstractValidator<LookupData>
    {
        public LookupDataValidator()
        {
            RuleFor(x => x.lookup_value_name).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Name should be not empty. NEVER!");           

        }
    }
}
