using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.ManualDataLoad.Shared.AWS_Secret_Manager;
using System.Data.SqlClient;

namespace OLDMutual.CTS.ManualDataLoad.Shared.Configuration
{
    public class ConfigurationSettings : IConfigurationSettings
    {

        private readonly IAwsSecretManager _aWSSecretManager;
        private readonly string host;
        private string BucketName;

        public ConfigurationSettings(IHttpContextAccessor httpContextAccessor, IAwsSecretManager aWSSecretManager)
        {
            IHttpContextAccessor _httpContextAccessor;
            _httpContextAccessor = httpContextAccessor;
            _aWSSecretManager = aWSSecretManager;
            host = _httpContextAccessor.HttpContext.Request.Host.Value;
        }
        /*  
       .......................................................................................................
       * This is the GetBucketName method      
       * GetBucketName() is used to get the bucket name specific to the environment
       .......................................................................................................
       */
        public string GetBucketName()
        {
            if (host.Contains("localhost"))
            {
                BucketName = _aWSSecretManager.GetSecret(Constants.Constants.AWS_SECRET_NONPRODS3BucketName);
            }
            else if (host.Contains("dev"))
            {
                BucketName = _aWSSecretManager.GetSecret(Constants.Constants.AWS_SECRET_NONPRODS3BucketName);
            }
            else if (host.Contains("qa"))
            {
                BucketName = _aWSSecretManager.GetSecret(Constants.Constants.AWS_SECRET_NONPRODS3BucketName);
            }
            else if (host.Contains("uat"))
            {
                BucketName = _aWSSecretManager.GetSecret(Constants.Constants.AWS_SECRET_UATS3BucketName);
            }
            else
            {
                BucketName = _aWSSecretManager.GetSecret(Constants.Constants.AWS_SECRET_PRODS3BucketName);
            }
            return BucketName;
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
            if (host.Contains("localhost") || host.Contains("dev"))
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
