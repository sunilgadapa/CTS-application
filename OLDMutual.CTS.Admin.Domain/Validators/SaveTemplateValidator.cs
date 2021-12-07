using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class SaveTemplateValidator : AbstractValidator<NotificationTemplateDto>
    {
        public SaveTemplateValidator()
        {
            RuleFor(x => x.NotificationTypeId).NotEmpty().NotNull().WithMessage("NotificationTypeId should not be empty or null.");
            RuleFor(x => x.EventId).NotEmpty().NotNull().WithMessage("EventId should not be empty or null.");
            RuleFor(x => x.NotificationTemplate).NotEmpty().NotNull().WithMessage("NotificationTemplate should not be empty or null.");
            RuleFor(x => x.EffectiveDate).NotEmpty().NotNull().WithMessage("EffectiveDate should not be empty or null.");
        }
    }
}
