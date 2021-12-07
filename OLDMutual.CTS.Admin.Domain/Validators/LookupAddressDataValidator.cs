using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class LookupAddressDataValidator : AbstractValidator<AddressData>
    {
        public LookupAddressDataValidator()
        {           
            RuleFor(x => x.city).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("City should be not empty.");

            RuleFor(x => x.postal_code).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Postal code should be not empty.");

            RuleFor(x => x.country).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Country should be not empty.");

            RuleFor(x => x.address_line1).Cascade(CascadeMode.Stop)
               .NotEmpty().WithMessage("Address line 1 should be not empty.");

            RuleFor(x => x.address_line2).Cascade(CascadeMode.Stop)
               .NotEmpty().WithMessage("Address line 2 should be not empty.");

            RuleFor(x => x.address_type_alias).Cascade(CascadeMode.Stop)
               .NotEmpty().WithMessage("Alias should be not empty.");

            RuleFor(x => x.effective_date).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Effective data should be not empty.");

            RuleFor(x => x.expiry_date).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Expiry date should be not empty.");

        }
    }
}
