using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using OLDMutual.CTS.ManualDataLoad.Domain.Models;
using OLDMutual.CTS.ManualDataLoad.Service.Interfaces;
using OLDMutual.CTS.ManualDataLoad.Shared.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OLDMutual.CTS.ManualDataLoad.Service.Services
{
    public class AwsS3BucketHelperService : IAwsS3BucketHelperService
    {
        private readonly IAmazonS3 _amazonS3;
        private readonly IConfigurationSettings _configurationSettings;
        CredentialProfile basicProfile;
        AWSCredentials awsCredentials;
        private readonly IHostEnvironment _env;
        public AwsS3BucketHelperService(IAmazonS3 s3Client, IHostEnvironment env, IConfigurationSettings configurationSettings)
        {
            _amazonS3 = s3Client;
            _configurationSettings = configurationSettings;
            _env = env;
        }
        /*  
     .......................................................................................................
     * This is the UploadFile helper method      
     * @param filename is used to get the file name as a method param
     * @param foldername is used to get the folder name as a method param
     * UploadFile() is used to upload the file in a S3 bucket
     .......................................................................................................
     */
        public async Task<int> UploadFile(System.IO.Stream inputStream, string fileName, string foldername)
        {
            PutObjectRequest request = new PutObjectRequest()
            {
                InputStream = inputStream,
                BucketName = _configurationSettings.GetBucketName(),
                Key = foldername + fileName,
                //  ContentBody = inputStream.ToString()
            };
            if (!(await Exists(foldername, fileName)))
            {
                PutObjectResponse response;
                if (_env.IsDevelopment())
                {
                    using (var client = new AmazonS3Client(awsCredentials, basicProfile.Region))
                    {
                        response = await client.PutObjectAsync(request);
                    }
                }
                else
                {
                    response = await _amazonS3.PutObjectAsync(request);
                }
                if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
                    return 2;
                else
                    return 3;
            }
            else
            {
                return 4;
            }
        }

        public async Task<bool> Exists(string path, string filename)
        {
            ListObjectsResponse response = new ListObjectsResponse();
            ListObjectsRequest request = new ListObjectsRequest
            {
                BucketName = _configurationSettings.GetBucketName(),
                Prefix = path + filename
            };
            if (_env.IsDevelopment())
            {
                var sharedFile = new SharedCredentialsFile();
                if (sharedFile.TryGetProfile("default", out basicProfile) &&
                    AWSCredentialsFactory.TryGetAWSCredentials(basicProfile, sharedFile, out awsCredentials))
                {
                    // use awsCredentials to create an Amazon S3 service client
                    using (var client = new AmazonS3Client(awsCredentials, basicProfile.Region))
                    {
                        response = await client.ListObjectsAsync(request);
                    }
                }
            }
            else
            {
                response = await _amazonS3.ListObjectsAsync(request);
            }
            if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
            {
                if (response.S3Objects.Count > 0)
                {

                    return true;
                }
                return false;
            }
            else
            {
                return false;
            }

        }

        /*  
     .......................................................................................................
     * This is the ProcessFile helper service method 
     * @param sourcepath is used to get the source folder name as a method param
     * @param destinationpah is used to get the destination folder name as a method param
     * @param file_name is used to get the file name as a method param      
     * ProcessFile() is used to process the file to move from one dir to another
     .......................................................................................................
     */
        public async Task<bool> ProcessFile(string sourcepath, string destinationpah, string fileName)
        {
            if (!(await Exists(destinationpah, fileName)))
            {
                CopyObjectRequest request = new CopyObjectRequest
                {
                    SourceBucket = _configurationSettings.GetBucketName(),
                    SourceKey = sourcepath + fileName,
                    DestinationBucket = _configurationSettings.GetBucketName(),
                    DestinationKey = destinationpah + fileName
                };
                if (_env.IsDevelopment())
                {
                    var sharedFile = new SharedCredentialsFile();
                    if (sharedFile.TryGetProfile("default", out basicProfile) &&
                        AWSCredentialsFactory.TryGetAWSCredentials(basicProfile, sharedFile, out awsCredentials))
                    {
                        // use awsCredentials to create an Amazon S3 service client
                        using (var client = new AmazonS3Client(awsCredentials, basicProfile.Region))
                        {
                            await client.CopyObjectAsync(request);
                        }
                    }
                }
                else
                {
                    await _amazonS3.CopyObjectAsync(request);
                }
                //after providing s3 bucket delete access this code invoked
                DeleteObjectRequest datarequest = new DeleteObjectRequest
                {
                    BucketName = _configurationSettings.GetBucketName(),
                    Key = sourcepath + fileName
                };                
                if (_env.IsDevelopment())
                {
                    using (var client = new AmazonS3Client(awsCredentials, basicProfile.Region))
                    {
                         await client.DeleteObjectAsync(datarequest);
                    }
                }
                else
                {
                    var s3Client = new AmazonS3Client();
                    await s3Client.DeleteObjectAsync(datarequest);
                }              
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<bool> DeleteFile(string sourcepath, string deletefoldername, string fileName)
        {
            CopyObjectRequest request = new CopyObjectRequest
            {
                SourceBucket = _configurationSettings.GetBucketName(),
                SourceKey = sourcepath + fileName,
                DestinationBucket = _configurationSettings.GetBucketName(),
                DestinationKey = deletefoldername + fileName
            };
            if (_env.IsDevelopment())
            {
                var sharedFile = new SharedCredentialsFile();
                if (sharedFile.TryGetProfile("default", out basicProfile) &&
                    AWSCredentialsFactory.TryGetAWSCredentials(basicProfile, sharedFile, out awsCredentials))
                {
                    // use awsCredentials to create an Amazon S3 service client
                    using (var client = new AmazonS3Client(awsCredentials, basicProfile.Region))
                    {
                        await client.CopyObjectAsync(request);
                    }
                }
            }
            else
            {
                await _amazonS3.CopyObjectAsync(request);
            }
            //after providing s3 bucket delete access this code invoked
            DeleteObjectRequest datarequest = new DeleteObjectRequest
            {
                BucketName = _configurationSettings.GetBucketName(),
                Key = sourcepath + fileName
            };          
            if (_env.IsDevelopment())
            {
                using (var client = new AmazonS3Client(awsCredentials, basicProfile.Region))
                {
                     await client.DeleteObjectAsync(datarequest);
                }
            }
            else
            {
                var s3Client = new AmazonS3Client();
                 await s3Client.DeleteObjectAsync(datarequest);
            }            
            return true;

        }

    }
}
