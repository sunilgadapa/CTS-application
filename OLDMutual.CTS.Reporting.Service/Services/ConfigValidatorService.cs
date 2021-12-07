using Microsoft.Extensions.Options;
using OLDMutual.CTS.Reporting.Domain.Models;
using OLDMutual.CTS.Reporting.Service.Interfaces;
using System;

namespace OLDMutual.CTS.Reporting.Service.Services
{


    public class ConfigValidatorService : IConfigValidatorService
    {
      
        public PowerBISettings _powerBISettings { get; }
        public ConfigValidatorService(IOptions<PowerBISettings> powerBISettings)
        {
            _powerBISettings = powerBISettings.Value;

        }
        

        /// <summary>
        /// Check if web.config embed parameters have valid values.
        /// </summary>
        /// <returns>Null if web.config parameters are valid, otherwise returns specific error string.</returns>
        public string GetWebConfigErrors()
        {
            string message = null;
            Guid result;

            // Application Id must have a value.
            if (string.IsNullOrWhiteSpace(_powerBISettings.ApplicationId))
            {
                message = "ApplicationId is empty. please register your application as Native app in https://dev.powerbi.com/apps and fill client Id in web.config.";
            }
            // Application Id must be a Guid object.
            else if (!Guid.TryParse(_powerBISettings.ApplicationId, out result))
            {
                message = "ApplicationId must be a Guid object. please register your application as Native app in https://dev.powerbi.com/apps and fill application Id in web.config.";
            }
            // Workspace Id must have a value.
            else if (_powerBISettings.WorkspaceId == string.Empty)
            {
                message = "WorkspaceId is empty or not a valid Guid. Please fill its Id correctly in web.config";
            }
            // Report Id must have a value.
            else if (_powerBISettings.ReportId == string.Empty)
            {
                message = "ReportId is empty or not a valid Guid. Please fill its Id correctly in web.config";
            }
            else if (_powerBISettings.AuthenticationType.Equals("masteruser", StringComparison.InvariantCultureIgnoreCase))
            {
                // Username must have a value.
                if (string.IsNullOrWhiteSpace(_powerBISettings.PbiUsername))
                {
                    message = "Username is empty. Please fill Power BI username in web.config";
                }
                // Password must have a value.
                if (string.IsNullOrWhiteSpace(_powerBISettings.PbiPassword))
                {
                    message = "Password is empty. Please fill password of Power BI username in web.config";
                }
            }
            else if (_powerBISettings.AuthenticationType.Equals("serviceprincipal", StringComparison.InvariantCultureIgnoreCase))
            {
                if (string.IsNullOrWhiteSpace(_powerBISettings.ApplicationSecret))
                {
                    message = "ApplicationSecret is empty. please register your application as Web app and fill appSecret in web.config.";
                }
                // Must fill tenant Id
                else if (string.IsNullOrWhiteSpace(_powerBISettings.Tenant))
                {
                    message = "Invalid Tenant. Please fill Tenant ID in Tenant under web.config";
                }
            }
            else
            {
                message = "Invalid authentication type";
            }

            return message;
        }
    }
}
