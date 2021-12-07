using Microsoft.Extensions.Configuration;
using OLDMutual.CTS.ManualDataLoad.Data.Interfaces;
using OLDMutual.CTS.ManualDataLoad.Service.Interfaces;
using System;
using System.IO;
using System.Threading.Tasks;


namespace OLDMutual.CTS.ManualDataLoad.Service.Services
{
    public class AwsS3BucketFileService : IAwsS3BucketFileService
    {
        private readonly IAwsS3BucketHelperService _AWSS3BucketHelper;
        private readonly IManualDataLoadService _dataload;
        private readonly IAwsS3File _aWSS3File;

        public AwsS3BucketFileService(IAwsS3BucketHelperService AWSS3BucketHelper, IManualDataLoadService dataload, IAwsS3File aWSS3File)
        {
            this._AWSS3BucketHelper = AWSS3BucketHelper;
            this._dataload = dataload;
            this._aWSS3File = aWSS3File;
        }
        /*  
      .......................................................................................................
      * This is the UploadFile service method  
      * @param file_type is used to get the file type id as a method param
      * @param tax_period is used to get the tax period as a method param
      * @param filename is used to get the file name as a method param
      * @param fullPath is used to get the file path as a method param
      * UploadFile() is used to upload the file in a S3 bucket
      .......................................................................................................
      */

        public async Task<int> UploadFile(string fullPath, int file_type, string filename, int tax_period)
        {
            using (var fsSource = new FileStream(fullPath, FileMode.Open))
            {                
                string fileName = filename;
                string foldername = await _dataload.GetFileType(file_type, 0) + @"ManualPickup/";
                int val = await _AWSS3BucketHelper.UploadFile(fsSource, fileName, foldername);
                if (val == 2)
                {
                    int result = 0;
                    result = await _aWSS3File.UploadFile(fullPath, file_type, fileName, tax_period);

                    if (result != 0)
                    {
                        return 1;
                    }
                    else { return val; }
                }
                else
                {
                    return val;
                }
            }
        }
        /*  
      .......................................................................................................
      * This is the ProcessFile service method 
      * @param file_id is used to get the file id as a method param
      * @param file_name is used to get the file name as a method param      
      * ProcessFile() is used to process the file to move from one dir to another
      .......................................................................................................
      */

        public async Task<bool> ProcessFile(int file_id, string filename)
        {
            string destinationfoldername = await _dataload.GetFileType(0, file_id) + @"Pickup/";
            string sourcefoldername = await _dataload.GetFileType(0, file_id) + @"ManualPickup/";
            bool val = await _AWSS3BucketHelper.ProcessFile(sourcefoldername, destinationfoldername, filename);
            if (val)
            {
                await _aWSS3File.ProcessFile(file_id, filename);
                return val;
            }
            return false;
        }
        /*  
       .......................................................................................................
       * This is the DeleteFile service method
       * @param file id is used to get the file id as method param
       * @param filename is used to get the file name
       * @param sourcefoldername is used to get the source folder name
       * @param deletefoldername is used to get the delete folder name
       * DeleteFile() is used to delte the file from a S3 bucket
       .......................................................................................................
       */
        public async Task<bool> DeleteFile(int file_id, string filename, string sourcefoldername, string deletefoldername)
        {
            await _AWSS3BucketHelper.DeleteFile(sourcefoldername, deletefoldername, filename);
            return false;
        }
    }
}
