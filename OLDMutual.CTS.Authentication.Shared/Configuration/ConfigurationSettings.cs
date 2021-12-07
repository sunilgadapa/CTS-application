using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using OLDMutual.CTS.Identity.Shared.AWS_Secret_Manager;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace OLDMutual.CTS.Identity.Shared.Configuration
{
    public class ConfigurationSettings : IConfigurationSettings
    {         
        private readonly IAwsSecretManager _aWSSecretManager;
        private readonly string host;

        public ConfigurationSettings(IHttpContextAccessor httpContextAccessor, IAwsSecretManager aWSSecretManager)
        {
            IHttpContextAccessor _httpContextAccessor;
            _httpContextAccessor = httpContextAccessor;
            _aWSSecretManager = aWSSecretManager;
            host = _httpContextAccessor.HttpContext.Request.Host.Value;
        }
        /*  
       .......................................................................................................
       * This is the GetConnectionString method      
       * GetConnectionString() is used to get the connection string specific to the environment
       .......................................................................................................
       */
        public SqlConnectionStringBuilder GetConnectionString()
        {
            string SecretValue;
            SqlConnectionStringBuilder builder;
            if (host.Contains("localhost"))
            {
                SecretValue = _aWSSecretManager.GetSecret(Constants.Constants.AWS_SECRET_LOCALConStr);
                builder = new SqlConnectionStringBuilder(SecretValue);
            }
            else if (host.Contains("dev"))
            {
                SecretValue = _aWSSecretManager.GetSecret(Constants.Constants.AWS_SECRET_DEVConStr);
                builder = new SqlConnectionStringBuilder(SecretValue);
            }
            else if (host.Contains("qa"))
            {
                SecretValue = _aWSSecretManager.GetSecret(Constants.Constants.AWS_SECRET_QAConStr);
                builder = new SqlConnectionStringBuilder(SecretValue);
            }
            else if (host.Contains("uat"))
            {
                SecretValue = _aWSSecretManager.GetSecret(Constants.Constants.AWS_SECRET_UATConStr);
                builder = new SqlConnectionStringBuilder(SecretValue);
            }
            else
            {
                SecretValue = _aWSSecretManager.GetSecret(Constants.Constants.AWS_SECRET_PRODConStr);
                builder = new SqlConnectionStringBuilder(SecretValue);
            }
            return builder;


        }

    }
}
