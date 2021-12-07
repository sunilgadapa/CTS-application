using FluentValidation;
using OLDMutual.CTS.UserManagement.Domain.Models;

namespace OLDMutual.CTS.UserManagement.Domain.Validators
{
    public class UserManagementDtoValidator : AbstractValidator<UserManagementDto>
    {
        public UserManagementDtoValidator()
        {
            RuleFor(x => x.UserId).NotEmpty().NotNull().WithMessage("UserId should be not empty or null.");
            RuleFor(x => x.DateOfExpiry).NotEmpty().NotNull().WithMessage("DateOfExpiry should be not empty or null.");
            RuleFor(x => x.RoleId).NotEmpty().NotNull().WithMessage("RoleId should be not empty or null.");
            RuleFor(x => x.TaxModuleId).NotEmpty().NotNull().WithMessage("TaxModuleId should be not empty or null.");
            RuleFor(x => x.LookupEntities).NotEmpty().NotNull().WithMessage("LookupEntities should be not empty or null.");

        }
    }
}
