using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Reporting.Service.Interfaces
{
    public interface IConfigValidatorService
    {
        /// <summary>
        /// Check if web.config embed parameters have valid values.
        /// </summary>
        /// <returns>Null if web.config parameters are valid, otherwise returns specific error string.</returns>
        string GetWebConfigErrors();
    }
}
