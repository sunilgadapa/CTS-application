using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.SnsNotification.Shared.AWS_Secret_Manager;
using System.Data.SqlClient;

namespace OLDMutual.CTS.SnsNotification.Shared.Configuration
{
    public class ConfigurationSettings : IConfigurationSettings
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IAwsSecretManager _aWSSecretManager;


        public ConfigurationSettings(IHttpContextAccessor httpContextAccessor, IAwsSecretManager aWSSecretManager)
        {
            _httpContextAccessor = httpContextAccessor;
            _aWSSecretManager = aWSSecretManager;
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
                var host= _httpContextAccessor.HttpContext.Request.Host.Value;
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
            catch
            {
                return new SqlConnectionStringBuilder();
                throw;
            }

        }

    }
}
