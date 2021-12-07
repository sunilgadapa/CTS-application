using FluentValidation;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Admin.Domain.Validators
{
    public class SaveLookupDtoValidator : AbstractValidator<SaveLookup>
    {
        public SaveLookupDtoValidator()
        {
            RuleFor(x => x.Ids).NotEmpty().NotNull().WithMessage("Ids should be not empty or null.");
            RuleFor(x => x.lookup_type_name).NotEmpty().NotNull().WithMessage("Lookup Name should be not empty or null.");
        }

        /// <summary>
        /// Validate save look up before save
        /// </summary>
        /// <param name="saveLookup">saveLookup object</param>
        /// <returns>error list</returns>
        public List<string> ValidateLookUp(SaveLookup saveLookup)
        {
            List<string> ValidationMessages = new List<string>();
            if (saveLookup.Ids.Length == 0 && saveLookup.totalselectedrows == 0)
            {
                ValidationMessages.Add("Please select atleast one record.");
            }
            if (string.IsNullOrEmpty(saveLookup.lookup_type_name))
            {
                ValidationMessages.Add("Lookup Name should be not empty or null.");
            }
            return ValidationMessages;
        }
    }
}
