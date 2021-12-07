using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class AddRoleAndUserValidator : AbstractValidator<NotificationConfigDto>
    {
        public AddRoleAndUserValidator()
        {
            RuleFor(x => x.EntityToAdd).NotEmpty().NotNull().WithMessage("EntityToAdd should not be empty or null.");
            RuleFor(x => x.EventIds).NotEmpty().NotNull().WithMessage("EventIds should not be empty or null.");
        }
    }
}
