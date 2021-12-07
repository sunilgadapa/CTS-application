using Dapper;
using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.ManualDataLoad.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.ManualDataLoad.Data.Interfaces;
using System;
using System.Data;
using System.Threading.Tasks;

namespace OLDMutual.CTS.ManualDataLoad.Data.Data_Access_Layer
{
    public class AwsS3FileDao : IAwsS3File
    {
        private readonly IDapper _dapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public AwsS3FileDao(IDapper dapper, IHttpContextAccessor httpContextAccessor)
        {
            _dapper = dapper;
            _httpContextAccessor = httpContextAccessor;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        protected virtual void Dispose(bool disposing)
        {
            // Cleanup
        }
        /*  
     .......................................................................................................
     * This is the UploadFile DAO method  
     * @param file_type is used to get the file type id as a method param
     * @param tax_period is used to get the tax period as a method param
     * @param filename is used to get the file name as a method param
     * @param fullPath is used to get the file path as a method param
     * UploadFile() is used to upload the file in a S3 bucket
     .......................................................................................................
     */
        public async Task<int> UploadFile(string fullPath, int file_type, string filename, int tax_perid)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int result = 0;
            string Query = "SP_AddManuALDATALoad";
            DynamicParameters param = new DynamicParameters();
            param.Add("@filename", filename);
            param.Add("@file_storage_path", fullPath);
            param.Add("@file_storage_type", "Application");
            param.Add("@document_type_id", file_type);
            param.Add("@file_upload_type", "Manual Load");
            param.Add("@financialyear", tax_perid);
            param.Add("@ACTION", "I");
            param.Add("@username", userName);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }
        /*  
        .......................................................................................................
        * This is the ProcessFile helper DAO method 
        * @param file_id is used to get the file id as a method param
        * @param file_name is used to get the file name as a method param      
        * ProcessFile() is used to process the file to move from one dir to another
        .......................................................................................................
        */
        public async Task<bool> ProcessFile(int file_id, string filename)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            bool val = true;
            string Query = "SP_AddManuALDATALoad";
            DynamicParameters param = new DynamicParameters();
            param.Add("@file_id", file_id);
            param.Add("@ACTION", "U");
            param.Add("@username", userName);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return val;
        }

    }
}
