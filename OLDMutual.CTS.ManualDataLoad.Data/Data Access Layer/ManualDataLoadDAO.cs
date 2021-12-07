using Dapper;
using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.ManualDataLoad.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.ManualDataLoad.Data.Interfaces;
using OLDMutual.CTS.ManualDataLoad.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace OLDMutual.CTS.ManualDataLoad.Data.Data_Access_Layer
{
    public class ManualDataLoadDao : IManualDataLoad
    {
        private readonly IDapper _dapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ManualDataLoadDao(IDapper dapper, IHttpContextAccessor httpContextAccessor)
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
       * This is the GetDropdowndata DAO method
       * @param type is used to specify the name of the drop down list
       * GetDropdowndata() is used to get drop down data on manual data load page
       .......................................................................................................
       */
        public async Task<IEnumerable<DataLoadDropdown>> GETDropDownData(string type)
        {
            string Query = "SP_ManuALDATALoadDropdown";
            DynamicParameters param = new DynamicParameters();
            param.Add("@type", type);

            var result = await Task.FromResult(_dapper.GetAll<DataLoadDropdown>(Query, param, commandType: CommandType.StoredProcedure));
            result = result.ToList();
            return result;
        }

        public async Task<string> GetFileType(int document_id, int file_id)
        {
            string Query = "SP_GetDocumentType";
            DynamicParameters param = new DynamicParameters();
            param.Add("@document_type_id", document_id);
            param.Add("@file_id", file_id);

            var result = await Task.FromResult(_dapper.GetAll<DataLoadDropdown>(Query, param, commandType: CommandType.StoredProcedure));
            return result.Select(x => x.Name).FirstOrDefault();
        }
        /*  
       .......................................................................................................
       * This is the GetDataLoad DAO method 
       * @param data is used to specify the name filter data in a JSON format as a method param
       * @param dtfiletype is used to get the file type ids in data table forma
       * @param dtstatus is used to get the status ids in data table forma
       * @param dtperiod is used to get the period ids in data table forma
       * @param dtloadtype is is used to get the load type ids in data table forma
       * GetDataLoad() is used to get files data on the manual data load page by selected filters
       .......................................................................................................
       */
        public async Task<IEnumerable<DataLoad>> GETDataLoad(DataLoad data, DataTable dtfiletype, DataTable dtstatus, DataTable dtperiod, DataTable dtloadtype)
        {
            string Query = "SP_ManuALDATALoad";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Page", data.Page);
            param.Add("@Size", data.Size);
            param.Add("@searchtext", data.SearchText);
            param.Add("@file_type", dtfiletype.AsTableValuedParameter());
            param.Add("@status_type", dtstatus.AsTableValuedParameter());
            param.Add("@Load_Type", dtloadtype.AsTableValuedParameter());
            param.Add("@period", dtperiod.AsTableValuedParameter());
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            var result = await Task.FromResult(_dapper.GetAll<DataLoad>(Query, param, commandType: CommandType.StoredProcedure));

            int val = param.Get<int>("@RowsAffected");
            result.ToList().ForEach(x => x.totalrows = val);
            return result;
        }

        public async Task<int> DeleteFile(DataTable dt)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int result = 0;
            string Query = "SP_AddManuALDATALoad";
            DynamicParameters param = new DynamicParameters();
            param.Add("@dtmutualdataload", dt.AsTableValuedParameter());
            param.Add("@ACTION", "D");
            param.Add("@username", userName);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }

        public async Task<int> DeleteErrorRecord(FileErrorModel lookupdata)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            DataTable dt = new DataTable();
            dt.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < lookupdata.Ids.Length; i++)
            {
                row = dt.NewRow();
                row["ID"] = lookupdata.Ids[i];
                dt.Rows.Add(row);
            }
            int result = 0;
            string Query = "SP_DeleteFileRecord";
            DynamicParameters param = new DynamicParameters();
            param.Add("@file_type", lookupdata.file_type);
            param.Add("@dtmutualdataload", dt.AsTableValuedParameter());
            param.Add("@username", userName);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }
        /*  
       .......................................................................................................
       * This is the GetFileDataById DAO method
       * @param file_id is used to get the file id as a method param
       * GetFileDataById() is used to get the file details by id
       .......................................................................................................
       */
        public async Task<IEnumerable<DataLoad>> GETDataLoadByid(int file_id)
        {
            string Query = "SP_AddManuALDATALoadError";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Action", "P");
            param.Add("@file_id", file_id);

            var result = await Task.FromResult(_dapper.GetAll<DataLoad>(Query, param, commandType: CommandType.StoredProcedure));
            return result.ToList();
        }
        /*  
    .......................................................................................................
    * This is the SignOffFile DAO method
    * @param lookupdata is used to get the file details as a method param  
    * SignOffFile() is used to sign off the file
    .......................................................................................................
    */
        public async Task<int> SignOffFile(SignOffDto lookupdata)
        {
            int result = 0;
            string Query = "SP_SignOffPASFile";
            DynamicParameters param = new DynamicParameters();
            param.Add("@status", lookupdata.status);
            param.Add("@file_id", lookupdata.file_id);
            param.Add("@document_type__id", lookupdata.document_type_id);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }
        /*  
     .......................................................................................................
     * This is the GETDataLoadHeadderErrorBy DAO method
     * @param file_id is used to get the file id as a method param
     * @param documment_type_id is used to get the file type id as a method param
     * @param page_no is used to get the page number as a method param
     * @param size is used to get the page size as a method param
     * GETDataLoadHeadderErrorBy() is used to get the data load error headers
     .......................................................................................................
     */
        public async Task<IEnumerable<DataLoadErrorCol>> GETDataLoadHeadderErrorBy(int file_id, int document_type_id, int page_no, int size)
        {
            string Query = "SP_ManuALDATALoadErrorColoumn";
            DynamicParameters param = new DynamicParameters();
            param.Add("@file_id", file_id);
            param.Add("@type", document_type_id);
            param.Add("@Page", page_no);
            param.Add("@Size", size);

            var result = await Task.FromResult(_dapper.GetAll<DataLoadErrorCol>(Query, param, commandType: CommandType.StoredProcedure));
            return result;
        }
        /*  
       .......................................................................................................
       * This is the GetDataLoadError DAO method
       * @param file_id is used to get the file id as a method paramr
       * @param documment_type_id is used to get the file type id as a method paramr
       * @param page_no is used to get the page number as a method paramr
       * @param size is used to get the page size as a method paramr
       * GetDataLoadError() is used to the data load errors
       .......................................................................................................
       */
        public async Task<IEnumerable<object>> GETDataLoadErrorBy(int file_id, int document_type_id, int page_no, int size)
        {
            string Query = "SP_AddManuALDATALoadError";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Action", "C");
            param.Add("@file_id", file_id);
            param.Add("@type", document_type_id);
            param.Add("@Page", page_no);
            param.Add("@Size", size);

            if (document_type_id == 1 || document_type_id == 19)
            {
                var result = await Task.FromResult(_dapper.GetAll<StgItcClientDetailData>(Query, param, commandType: CommandType.StoredProcedure));
                param.Add("@Action", "CC");
                var resultval = await Task.FromResult(_dapper.Execute(Query, "", param, commandType: CommandType.StoredProcedure));
                result.ToList().ForEach(x => x.totalrows = resultval);
                return result;
            }
            else if (document_type_id == 2)
            {
                var result = await Task.FromResult(_dapper.GetAll<StgItcIntermediaryData>(Query, param, commandType: CommandType.StoredProcedure));

                param.Add("@Action", "CC");
                var resultval = await Task.FromResult(_dapper.Execute(Query, "", param, commandType: CommandType.StoredProcedure));
                result.ToList().ForEach(x => x.totalrows = resultval);

                return result;
            }
            else if (document_type_id == 4)
            {
                var result = await Task.FromResult(_dapper.GetAll<StgItcPreferredCorrespondence>(Query, param, commandType: CommandType.StoredProcedure));
                param.Add("@Action", "CC");
                var resultval = await Task.FromResult(_dapper.Execute(Query, "", param, commandType: CommandType.StoredProcedure));
                result.ToList().ForEach(x => x.totalrows = resultval);
                return result;
            }
            else if (document_type_id == 6)
            {
                var result = await Task.FromResult(_dapper.GetAll<StgItcSampleCertificates>(Query, param, commandType: CommandType.StoredProcedure));

                param.Add("@Action", "CC");
                var resultval = await Task.FromResult(_dapper.Execute(Query, "", param, commandType: CommandType.StoredProcedure));
                result.ToList().ForEach(x => x.totalrows = resultval);
                return result;
            }
            else if (document_type_id == 3)
            {
                var result = await Task.FromResult(_dapper.GetAll<StgClientGcsResponse>(Query, param, commandType: CommandType.StoredProcedure));

                param.Add("@Action", "CC");
                var resultval = await Task.FromResult(_dapper.Execute(Query, "", param, commandType: CommandType.StoredProcedure));
                result.ToList().ForEach(x => x.totalrows = resultval);
                return result;
            }
            return null;

        }
        /*  
  .......................................................................................................
  * This is the AddGCSDataError DAO method  
  * @param dtPerferd is used to get the data table as a method param         
  * AddPreferedNewDataError() is used to update the prefered corresponsdence file error data
  .......................................................................................................
  */
        public async Task<int> AddPreferedNewDataError(DataTable dtPerferd)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int result = 0;
            string Query = "SP_PreferdNewData";
            DynamicParameters param = new DynamicParameters();

            if (dtPerferd.Rows.Count > 0)
            {
                param.Add("@dtstgprefered", dtPerferd.AsTableValuedParameter());
            }
            param.Add("@username", userName);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }
        /*  
  .......................................................................................................
  * This is the AddSampleCertificateError DAO method  
  * @param dtPerferd is used to get the data table as a method param         
  * AddSampleCertificateError() is used to update the sample certificate file error data
  .......................................................................................................
  */
        public async Task<int> AddSampleCertificateError(DataTable dtPerferd)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int result = 0;
            string Query = "SP_SampleCertificateData";
            DynamicParameters param = new DynamicParameters();

            if (dtPerferd.Rows.Count > 0)
            {
                param.Add("@dtstgprefered", dtPerferd.AsTableValuedParameter());
            }
            param.Add("@username", userName);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }
        /*  
  .......................................................................................................
  * This is the AddAdvisorDataError DAO method  
  * @param dtPerferd is used to get the data table as a method param         
  * AddAdvisorDataError() is used to update the advisor file error data
  .......................................................................................................
  */
        public async Task<int> AddAdvisorDataError(DataTable dtPerferd)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int result = 0;
            string Query = "SP_AdvisorData";
            DynamicParameters param = new DynamicParameters();

            if (dtPerferd.Rows.Count > 0)
            {
                param.Add("@dtstgprefered", dtPerferd.AsTableValuedParameter());
            }
            param.Add("@username", userName);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }
        /*  
  .......................................................................................................
  * This is the AddClientThiredpartyDataError DAO method  
  * @param dtPerferd is used to get the data table as a method param         
  * AddClientThiredpartyDataError() is used to update the client third party file error data
  .......................................................................................................
  */
        public async Task<int> AddClientThiredpartyDataError(DataTable dtPerferd)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int result = 0;
            string Query = "SP_ClientthiredPartyData";
            DynamicParameters param = new DynamicParameters();

            if (dtPerferd.Rows.Count > 0)
            {
                param.Add("@dtstgprefered", dtPerferd.AsTableValuedParameter());
            }
            param.Add("@username", userName);
            param.Add("@CALLING_STREAM", "UI");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));

            return result;
        }
        /*  
  .......................................................................................................
  * This is the AddGCSDataError DAO method  
  * @param dtPerferd is used to get the data table as a method param         
  * AddGCSDataError() is used to update the GCS file error data
  .......................................................................................................
  */
        public async Task<int> AddGCSDataError(DataTable dtPerferd)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int result = 0;
            string Query = "SP_GCSClientRequest";
            DynamicParameters param = new DynamicParameters();

            if (dtPerferd.Rows.Count > 0)
            {
                param.Add("@dtstgprefered", dtPerferd.AsTableValuedParameter());
            }
            param.Add("@username", userName);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }

        public async Task<IEnumerable<DataLoad>> GetPasDataLoad(DataLoad data, DataTable dtSrcSym, DataTable dtStatus, DataTable dtFileType, DataTable dtTaxPeriodType)
        {
            string Query = "SP_PasManualDataLoad";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Page", data.Page);
            param.Add("@Size", data.Size);
            param.Add("@searchtext", data.SearchText);
            param.Add("@dtSourceSystem", dtSrcSym.AsTableValuedParameter());
            param.Add("@dtStatusType", dtStatus.AsTableValuedParameter());
            param.Add("@dtFileType", dtFileType.AsTableValuedParameter());
            param.Add("@dtTaxPeriodType", dtTaxPeriodType.AsTableValuedParameter());
            param.Add("@taxModuleId", data.TaxModuleId);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            var result = await Task.FromResult(_dapper.GetAll<DataLoad>(Query, param, commandType: CommandType.StoredProcedure));

            int val = param.Get<int>("@RowsAffected");
            result.ToList().ForEach(x => x.totalrows = val);
            return result;
        }

        public async Task<IEnumerable<DataLoadErrorCol>> GetErrorDescription(int file_id, int document_type_id, DataTable dt)
        {
            string Query = "SP_ManualDataLoadGetErrorDesc";
            DynamicParameters param = new DynamicParameters();
            param.Add("@file_id", file_id);
            param.Add("@type", document_type_id);
            param.Add("@dtRowIds", dt.AsTableValuedParameter());

            var result = await Task.FromResult(_dapper.GetAll<DataLoadErrorCol>(Query, param, commandType: CommandType.StoredProcedure));
            return result;
        }

        public async Task<IEnumerable<DataLoad>> GetPasFileDataById(int file_id)
        {
            string Query = "SP_GetPasFileDataById";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Action", "P");
            param.Add("@file_id", file_id);

            var result = await Task.FromResult(_dapper.GetAll<DataLoad>(Query, param, commandType: CommandType.StoredProcedure));
            return result.ToList();
        }

        public async Task<int> UpdateMemberFileErrorData(DataTable dtPerferd)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int result = 0;
            string Query = "SP_UpdateMemberFileErrorData";
            DynamicParameters param = new DynamicParameters();

            if (dtPerferd.Rows.Count > 0)
            {
                param.Add("@dtstg", dtPerferd.AsTableValuedParameter());
            }
            param.Add("@username", userName);
            param.Add("@CALLING_STREAM", "UI");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }

        public async Task<int> UpdateAdvisorFileErrorData(DataTable dtPerferd)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int result = 0;
            string Query = "SP_UpdateAdvisorFileErrorData";
            DynamicParameters param = new DynamicParameters();

            if (dtPerferd.Rows.Count > 0)
            {
                param.Add("@dtstg", dtPerferd.AsTableValuedParameter());
            }
            param.Add("@username", userName);
            param.Add("@CALLING_STREAM", "UI");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }

        public async Task<int> UpdateFinanceFileErrorData(DataTable dtPerferd)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int result = 0;
            string Query = "SP_UpdateFinanceFileErrorData";
            DynamicParameters param = new DynamicParameters();

            if (dtPerferd.Rows.Count > 0)
            {
                param.Add("@dtstg", dtPerferd.AsTableValuedParameter());
            }
            param.Add("@username", userName);
            param.Add("@CALLING_STREAM", "UI");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }

        public async Task<IEnumerable<object>> GetPasDataLoadError(int file_id, int document_type_id, int page_no, int size)
        {
            string Query = "SP_GetPasFileDataById";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Action", "C");
            param.Add("@file_id", file_id);
            param.Add("@type", document_type_id);
            param.Add("@Page", page_no);
            param.Add("@Size", size);

            if (document_type_id == 9)
            {
                var result = await Task.FromResult(_dapper.GetAll<StgItcMembershipDetails>(Query, param, commandType: CommandType.StoredProcedure));

                param.Add("@Action", "CC");
                var resultval = await Task.FromResult(_dapper.Execute(Query, "", param, commandType: CommandType.StoredProcedure));
                result.ToList().ForEach(x => x.totalrows = resultval);
                result.ToList().ForEach(x => x.PolicyOnDate = x.PolicyOnDate != null ? Convert.ToDateTime(x.PolicyOnDate).ToString("yyyy/MM/dd") : "NULL");
                result.ToList().ForEach(x => x.PolicyOffDate = x.PolicyOffDate != null ? Convert.ToDateTime(x.PolicyOffDate).ToString("yyyy/MM/dd") : "NULL");
                return result;
            }
            else if (document_type_id == 10)
            {
                var result = await Task.FromResult(_dapper.GetAll<StgItcFinanceDetails>(Query, param, commandType: CommandType.StoredProcedure));

                param.Add("@Action", "CC");
                var resultval = await Task.FromResult(_dapper.Execute(Query, "", param, commandType: CommandType.StoredProcedure));
                result.ToList().ForEach(x => x.totalrows = resultval);

                return result;
            }
            else if (document_type_id == 11)
            {
                var result = await Task.FromResult(_dapper.GetAll<StgItcAdvisorDetails>(Query, param, commandType: CommandType.StoredProcedure));

                param.Add("@Action", "CC");
                var resultval = await Task.FromResult(_dapper.Execute(Query, "", param, commandType: CommandType.StoredProcedure));
                result.ToList().ForEach(x => x.totalrows = resultval);

                return result;
            }

            return null;
        }

        public async Task<IEnumerable<DataLoadErrorCol>> GetPasDataLoadErrorHeader(int file_id, int document_type_id, DataTable dtRows)
        {
            string Query = "SP_GetPasDataLoadErrorHeaderColoumn";
            DynamicParameters param = new DynamicParameters();
            param.Add("@file_id", file_id);
            param.Add("@type", document_type_id);
            param.Add("@dtRowIds", dtRows.AsTableValuedParameter());

            var result = await Task.FromResult(_dapper.GetAll<DataLoadErrorCol>(Query, param, commandType: CommandType.StoredProcedure));
            return result;
        }

        public async Task<int> CheckIfFileHasMissingInformation(int document_type_id, int file_id)
        {
            string Query = "SP_CheckIfFileHasMissingInformation";
            DynamicParameters param = new DynamicParameters();
            param.Add("@file_id", file_id);
            param.Add("@type", document_type_id);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            int result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }

        public async Task<IEnumerable<MissingInformationDto>> GetMissingInformationByFileId(int document_type_id, int file_id)
        {
            string Query = "SP_GetMissingInformationByFileId";
            DynamicParameters param = new DynamicParameters();
            param.Add("@file_id", file_id);
            param.Add("@type", document_type_id);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

            var counter = 1;
            var result = await Task.FromResult(_dapper.GetAll<MissingInformationDto>(Query, param, commandType: CommandType.StoredProcedure));

            int val = param.Get<int>("@RowsAffected");

            foreach (var item in result)
            {
                item.RowNumber = counter;
                item.TotalNumerOfRows = val;
                counter++;
            }
            return result;
        }

        public async Task<int> AddPasMissingInformation(string UserName, string LookupValueName, string LookupValueDescription, string LookupTypeName, int FileId, string misc_value)
        {
            string Query = "SP_AddMissingInformation";
            DynamicParameters param = new DynamicParameters();
            param.Add("@LookupValueName", LookupValueName.Trim());
            param.Add("@LookupValueDescription", LookupValueDescription);
            param.Add("@LookupTypeName", LookupTypeName.Trim());
            param.Add("@FileId", FileId);
            param.Add("@misc_value", misc_value);
            param.Add("@UserName", UserName);
            param.Add("@RowsChanged", DbType.Int32, direction: ParameterDirection.Output);

            int result = await Task.FromResult(_dapper.Execute(Query, "@RowsChanged", param, commandType: CommandType.StoredProcedure));
            return result;
        }

        public async Task<int> CheckIfLookupExists(string LookupValueName, string LookupTypeName, int FileId, string UserName)
        {
            string Query = "SP_CheckIfLookupExists";
            DynamicParameters param = new DynamicParameters();
            param.Add("@LookupValueName", LookupValueName.Trim());
            param.Add("@LookupTypeName", LookupTypeName.Trim());
            param.Add("@FileId", FileId);
            param.Add("@UserName", UserName);
            param.Add("@RowsChanged", DbType.Int32, direction: ParameterDirection.Output);

            int result = await Task.FromResult(_dapper.Execute(Query, "@RowsChanged", param, commandType: CommandType.StoredProcedure));
            return result;
        }
        public async Task<int> AddMissingTaxPeriodData(TaxPeriodDto taxPeriodDto, string UserName)
        {
            string sp = "SP_AddMissingInformationTaxPeriod";
            DynamicParameters param = new DynamicParameters();
            param.Add("@TaxTypeId", taxPeriodDto.TaxTypeId);
            param.Add("@TaxYear", taxPeriodDto.TaxYear);
            param.Add("@TaxPeriodTypeId", taxPeriodDto.TaxPeriodTypeId);
            param.Add("@TaxPeriodDescription", taxPeriodDto.TaxPeriodDescription);
            param.Add("@SubmissionPeriodStart", DateTime.ParseExact(taxPeriodDto.SubmissionStartDate, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US")));
            param.Add("@SubmissionPeriodEnd", DateTime.ParseExact(taxPeriodDto.SubmissionEndDate, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US")));
            param.Add("@LandingPeriodStart", DateTime.ParseExact(taxPeriodDto.LandingStartDate, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US")));
            param.Add("@LandingPeriodEnd", DateTime.ParseExact(taxPeriodDto.LandingEndDate, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US")));
            param.Add("@UserName", UserName);
            param.Add("@FileId", taxPeriodDto.FileId);
            param.Add("@RowsChanged", DbType.Int32, direction: ParameterDirection.Output);
            int result = await Task.FromResult(_dapper.Execute(sp, "@RowsChanged", param, commandType: CommandType.StoredProcedure));
            return result;
        }

        public async Task<int> ReprocessFile(int DocumentTypeId, int FileId, string UserName)
        {
            string sp = "SP_ReprocessFile";
            DynamicParameters param = new DynamicParameters();
            param.Add("@DocTypeId", DocumentTypeId);
            param.Add("@FileId", FileId);
            param.Add("@UserName", UserName);
            param.Add("@CallingStream", "UI");

            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            int result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }
    }
}
