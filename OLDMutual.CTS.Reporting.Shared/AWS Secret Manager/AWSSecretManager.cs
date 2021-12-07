using Amazon;
using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using Microsoft.Extensions.Hosting;
using System;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Reporting.Shared.AWS_Secret_Manager
{
    public class AwsSecretManager : IAwsSecretManager
    {
        private readonly IAmazonSecretsManager _amazonSecretsManager;
        private readonly IHostEnvironment _env;
        CredentialProfile basicProfile;
        AWSCredentials awsCredentials;       

        public AwsSecretManager(IHostEnvironment env, IAmazonSecretsManager amazonSecretsManager)
        {                     
            _amazonSecretsManager = amazonSecretsManager;
            _env = env;
        }
        /*  
       .......................................................................................................
       * This is the GetSecret method
       * @param secretName is used to specify the secret name     
       * GetSecret() is used to get secret from AWS secret manager cloud service
       .......................................................................................................
       */
        public string GetSecret(string secretName)
        {

            var request = new GetSecretValueRequest
            {
                SecretId = secretName
            };

            GetSecretValueResponse response = null;

            try
            {
                if (_env.IsDevelopment())
                {
                    var sharedFile = new SharedCredentialsFile();
                    if (sharedFile.TryGetProfile("default", out basicProfile) &&
                        AWSCredentialsFactory.TryGetAWSCredentials(basicProfile, sharedFile, out awsCredentials))
                    {
                        // use awsCredentials to get an secrets stored in Amazon secret manager service client
                        using (var client = new AmazonSecretsManagerClient(awsCredentials, basicProfile.Region))
                        {
                            response = Task.Run(async () => await client.GetSecretValueAsync(request)).Result;
                        }
                    }
                }
                else
                {
                    response = Task.Run(async () => await _amazonSecretsManager.GetSecretValueAsync(request)).Result;
                }
            }           
            catch (ResourceNotFoundException)
            {
                Console.WriteLine("The requested secret " + secretName + " was not found");
            }
            catch (InvalidRequestException e)
            {
                Console.WriteLine("The request was invalid due to: " + e.Message);
            }
            catch (InvalidParameterException e)
            {
                Console.WriteLine("The request had invalid params: " + e.Message);
            }

            return response?.SecretString;
        }
    }
}
