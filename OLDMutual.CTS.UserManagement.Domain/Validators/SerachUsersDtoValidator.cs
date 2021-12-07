using FluentValidation;
using OLDMutual.CTS.UserManagement.Domain.Models;

namespace OLDMutual.CTS.UserManagement.Domain.Validators
{
    public class SearchUsersDtoValidator : AbstractValidator<SearchUsersDto>
    {
        public SearchUsersDtoValidator()
        {
            RuleFor(x => x.Page).NotEmpty().NotNull().WithMessage("Page should be not empty or null.");
            RuleFor(x => x.Size).NotEmpty().NotNull().WithMessage("Size should be not empty or null.");
            RuleFor(x => x.Status).NotEmpty().NotNull().WithMessage("Status should be not empty or null.");
        }
    }
}
