using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class EmailDataValidator : AbstractValidator<EmailListdata>
    {
        public EmailDataValidator()
        {
            RuleForEach(x => x.EmailData).SetValidator(new LookupEmailDataValidator());

        }
    }
}
