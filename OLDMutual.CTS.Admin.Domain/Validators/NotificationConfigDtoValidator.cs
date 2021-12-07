using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class NotificationConfigDtoValidator : AbstractValidator<NotificationConfigDto>
    {
        public NotificationConfigDtoValidator()
        {
            RuleFor(x => x.TaxIds).NotEmpty().NotNull().WithMessage("TaxIds should not be empty or null.");
            RuleFor(x => x.EventIds).NotEmpty().NotNull().WithMessage("EventIds should not be empty or null.");
            RuleFor(x => x.SearchBy).NotEmpty().NotNull().WithMessage("SearchBy should not be empty or null.");
        }
    }
}
