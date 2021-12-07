using FluentValidation;
using OLDMutual.CTS.UserManagement.Domain.Models;

namespace OLDMutual.CTS.UserManagement.Domain.Validators
{
    public class DeleteUserDtoValidator : AbstractValidator<DeleteUserDto>
    {
        public DeleteUserDtoValidator()
        {
            RuleFor(x => x.UserIds).NotEmpty().NotNull().WithMessage("User Ids should be not empty or null.");

        }
    }
}
