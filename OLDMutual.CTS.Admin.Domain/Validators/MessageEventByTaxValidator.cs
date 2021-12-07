using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class MessageEventByTaxValidator : AbstractValidator<MessageEvents>
    {
        public MessageEventByTaxValidator()
        {
            RuleFor(x => x.tax_id).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("tax_ids should be not empty or null");
        }
    }
}
