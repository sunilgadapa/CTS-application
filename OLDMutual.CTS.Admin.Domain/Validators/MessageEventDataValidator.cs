using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class MessageEventDataValidator : AbstractValidator<MessageEvents>
    {
        public MessageEventDataValidator()
        {
            RuleFor(x => x.messaging_event).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Message Event be not empty. NEVER!");

            RuleFor(x => x.message_event_type).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Event type should be not empty. NEVER!");

            RuleFor(x => x.tax_module_id).Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Please select tax module. NEVER!");
        }
    }
}
