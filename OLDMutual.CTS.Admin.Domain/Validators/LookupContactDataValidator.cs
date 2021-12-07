using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class LookupContactDataValidator : AbstractValidator<ContactData>
    {
        public LookupContactDataValidator()
        {
            RuleFor(x => x.value).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Value should be not empty. NEVER!");

            RuleFor(x => x.effective_date).Cascade(CascadeMode.Stop)
               .NotEmpty().WithMessage("Effective data should be not empty. NEVER!");

            RuleFor(x => x.expiry_date).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Expiry date should be not empty. NEVER!");

        }
    }
}
