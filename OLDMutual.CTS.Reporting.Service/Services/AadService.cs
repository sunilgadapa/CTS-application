using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using OLDMutual.CTS.Reporting.Domain.Models;
using OLDMutual.CTS.Reporting.Service.Interfaces;
using System;
using System.Linq;
using System.Security;
using System.Threading.Tasks;


namespace OLDMutual.CTS.Reporting.Service.Services
{
    public class AadService : IAadService
    {
        private readonly string m_authorityUrl;
        private readonly string[] m_scope;
        private readonly PowerBISettings _powerBISettings;
        public AadService(IOptions<PowerBISettings> powerBISettings)
        {
            _powerBISettings = powerBISettings.Value;
            m_authorityUrl = _powerBISettings.AuthorityUrl;
            m_scope = _powerBISettings.Scope.Split(';');
        }



        /// <summary>
        /// Get Access token
        /// </summary>
        /// <returns>Access token</returns>
        public async Task<string> GetAccessToken()
        {
            AuthenticationResult authenticationResult = null;
            if (_powerBISettings.AuthenticationType.Equals("masteruser", StringComparison.InvariantCultureIgnoreCase))
            {
                IPublicClientApplication clientApp = PublicClientApplicationBuilder
                                                                    .Create(_powerBISettings.ApplicationId)
                                                                    .WithAuthority(m_authorityUrl)
                                                                    .Build();
                var userAccounts = await clientApp.GetAccountsAsync();

                try
                {
                    authenticationResult = await clientApp.AcquireTokenSilent(m_scope, userAccounts.FirstOrDefault()).ExecuteAsync();
                }
                catch (MsalUiRequiredException)
                {
                    SecureString secureStringPassword = new SecureString();
                    foreach (var key in _powerBISettings.PbiPassword)
                    {
                        secureStringPassword.AppendChar(key);
                    }
                    authenticationResult = await clientApp.AcquireTokenByUsernamePassword(m_scope, _powerBISettings.PbiUsername, secureStringPassword).ExecuteAsync();
                }
            }

            // Service Principal auth is recommended by Microsoft to achieve App Owns Data Power BI embedding
            else if (_powerBISettings.AuthenticationType.Equals("serviceprincipal", StringComparison.InvariantCultureIgnoreCase))
            {
                // For app only authentication, we need the specific tenant id in the authority url
                var tenantSpecificURL = m_authorityUrl.Replace("organizations", _powerBISettings.Tenant);

                IConfidentialClientApplication clientApp = ConfidentialClientApplicationBuilder
                                                                                .Create(_powerBISettings.ApplicationId)
                                                                                .WithClientSecret(_powerBISettings.ApplicationSecret)
                                                                                .WithAuthority(tenantSpecificURL)
                                                                                .Build();

                authenticationResult = await clientApp.AcquireTokenForClient(m_scope).ExecuteAsync();
            }
            if (authenticationResult != null)
            {
                return authenticationResult.AccessToken;
            }
            else
            {
                return string.Empty ;
            }
        }
    }
}
