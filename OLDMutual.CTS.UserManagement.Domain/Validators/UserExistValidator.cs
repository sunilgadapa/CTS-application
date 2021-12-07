using FluentValidation;
using OLDMutual.CTS.UserManagement.Domain.Models;

namespace OLDMutual.CTS.UserManagement.Domain.Validators
{
    public class UserExistValidator : AbstractValidator<UserExist>
    {
        public UserExistValidator()
        {
            RuleFor(x => x.UserName).NotEmpty().NotNull().WithMessage("UserName should be not empty or null.");
        }
    }
}
