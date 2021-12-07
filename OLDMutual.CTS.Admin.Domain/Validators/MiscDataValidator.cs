using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class MiscDataValidator : AbstractValidator<Miscellaneousdata>
    {
        public MiscDataValidator()
        {
            RuleForEach(x => x.MiscData).SetValidator(new LookupMiscDataValidator());

        }
    }
}
