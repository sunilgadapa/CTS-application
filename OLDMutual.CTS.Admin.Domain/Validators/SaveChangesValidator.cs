using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class SaveChangesValidator : AbstractValidator<NotificationConfigDto>
    {
        public SaveChangesValidator()
        {
            RuleFor(x => x.RoleArray).NotEmpty().NotNull().WithMessage("RoleArray should not be empty or null.");
            RuleFor(x => x.EventIds).NotEmpty().NotNull().WithMessage("EventIds should not be empty or null.");
            RuleFor(x => x.Ids).NotEmpty().NotNull().WithMessage("Ids should not be empty or null.");
        }
    }
}
