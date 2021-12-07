using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class ContactDataValidator : AbstractValidator<ContactListdata>
    {
        public ContactDataValidator()
        {
            RuleForEach(x => x.ContactData).SetValidator(new LookupContactDataValidator());

        }
    }
}
