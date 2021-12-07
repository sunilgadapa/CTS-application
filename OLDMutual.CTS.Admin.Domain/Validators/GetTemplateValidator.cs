using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class GetTemplateValidator : AbstractValidator<NotificationTemplateDto>
    {
        public GetTemplateValidator()
        {
            RuleFor(x => x.NotificationTypeId).NotEmpty().NotNull().WithMessage("NotificationTypeId should not be empty or null.");
            RuleFor(x => x.EventId).NotEmpty().NotNull().WithMessage("EventId should not be empty or null.");

        }
    }
}
