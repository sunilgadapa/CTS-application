using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.Reporting.Shared.AWS_Secret_Manager;
using System;
using System.Data.SqlClient;

namespace OLDMutual.CTS.Reporting.Shared.Configuration
{
    public class ConfigurationSettings : IConfigurationSettings
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IAwsSecretManager _awsSecretManager;

        public ConfigurationSettings(IHttpContextAccessor httpContextAccessor, IAwsSecretManager aWSSecretManager)
        {
            _httpContextAccessor = httpContextAccessor;
            _awsSecretManager = aWSSecretManager;
        }
        /*  
      .......................................................................................................
      * This is the GetConnectionString method      
      * GetConnectionString() is used to get the connection string specific to the environment
      .......................................................................................................
      */
        public SqlConnectionStringBuilder GetConnectionString()
        {
            try
            {
                var host = _httpContextAccessor.HttpContext.Request.Host.Value;
                string SecretValue;
                SqlConnectionStringBuilder builder;
                if (host.Contains("localhost"))
                {
                    SecretValue = _awsSecretManager.GetSecret(Constants.Constants.AWS_SECRET_LOCALConStr);
                    builder = new SqlConnectionStringBuilder(SecretValue);
                }
                else if (host.Contains("dev"))
                {
                    SecretValue = _awsSecretManager.GetSecret(Constants.Constants.AWS_SECRET_DEVConStr);
                    builder = new SqlConnectionStringBuilder(SecretValue);
                }
                else if (host.Contains("qa"))
                {
                    SecretValue = _awsSecretManager.GetSecret(Constants.Constants.AWS_SECRET_QAConStr);
                    builder = new SqlConnectionStringBuilder(SecretValue);
                }
                else if (host.Contains("uat"))
                {
                    SecretValue = _awsSecretManager.GetSecret(Constants.Constants.AWS_SECRET_UATConStr);
                    builder = new SqlConnectionStringBuilder(SecretValue);
                }
                else
                {
                    SecretValue = _awsSecretManager.GetSecret(Constants.Constants.AWS_SECRET_PRODConStr);
                    builder = new SqlConnectionStringBuilder(SecretValue);
                }
                return builder;
            }
            catch
            {
                return new SqlConnectionStringBuilder(); 
                throw;
            }

        }

        /// <summary>
        /// get environment detail
        /// </summary>
        /// <returns>environment</returns>

        /*  
       .......................................................................................................
       * This is the GetEnvironment method      
       * GetEnvironment() is used to get the Environment name specific to the Environment
       .......................................................................................................
       */
        public (string, string) GetEnvironment()
        {
            var host = _httpContextAccessor.HttpContext.Request.Host.Value;
            var env = "dev";
            var dbName = "omcusttaxdev";
            if (host.Contains("localhost") || host.Contains("dev"))
            {
                env = "dev";
                dbName = "omcusttaxdev";
            }

            else if (host.Contains("qa"))
            {
                env = "qa";
                dbName = "omcusttaxdqa";
            }

            return (env, dbName);
        }
    }
}
