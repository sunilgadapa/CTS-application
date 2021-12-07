using Dapper;
using OLDMutual.CTS.Correspondence.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.Correspondence.Data.Interfaces;
using OLDMutual.CTS.Correspondence.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Correspondence.Data.Data_Access_Layer
{
    /// <summary>
    /// Correspondence DAO Class
    /// </summary>
    public class CorrespondenceDAO : ICorrespondence
    {
        private readonly IDapper _dapper;
        public CorrespondenceDAO(IDapper dapper)
        {
            _dapper = dapper;
        }
        public void Dispose()
        {

        }

        /// <summary>
        /// Get Drop Down Value
        /// </summary>
        /// <param name="type"></param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<DataLoadDropdown>> GETDropDownData(string type)
        {
            try
            {
                string Query = "SP_ManuALDATALoadDropdown";
                DynamicParameters param = new DynamicParameters();
                param.Add("@type", type);

                var result = await Task.FromResult(_dapper.GetAll<DataLoadDropdown>(Query, param, commandType: CommandType.StoredProcedure));
                result = result.ToList();
                return result;
            }
            catch(Exception)
            {
                throw;
            }
        }
        /// <summary>
        /// Get SARS Submission Data
        /// </summary>
        /// <param name="data"></param>
        /// <param name="dtfileregiontype"></param>
        /// <param name="dtstatus"></param>
        /// <param name="dtfundentity"></param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<CorrespondenceData>> GetCorrespondenceData(CorrespondenceData data, DataTable dtfileregiontype, DataTable dtstatus, DataTable dtfundentity)
        {
            try
            {
                string Query = "sp_sars_sbmission_get_data";
                DynamicParameters param = new DynamicParameters();
                param.Add("@Page", data.Page);
                param.Add("@Size", data.Size);
                param.Add("@searchtext", data.Searchtext);
                param.Add("@sars_submission_id", data.CorrespondenceId);
                param.Add("@status_type", dtstatus.AsTableValuedParameter());
                param.Add("@fund_entity", dtfundentity.AsTableValuedParameter());
                param.Add("@file_region", dtfileregiontype.AsTableValuedParameter());
                var result = await Task.FromResult(_dapper.GetAll<CorrespondenceData>(Query, param, commandType: CommandType.StoredProcedure));
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Change SARS submission file status .
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <param name="userName">User Name</param>
        /// <returns>true false</returns>
        public async Task<bool> PromoteCorrespondence(int file_id, string userName)
        {
            try
            {
                bool val = false;
                string Query = "SP_UPDATE_SARS_SUBMISSION";
                DynamicParameters param = new DynamicParameters();
                param.Add("@file_id", file_id);
                param.Add("@username", userName);
                param.Add("@ACTION", "PROMOTE");
                param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
                var result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
                if (result > 0)
                {
                    val = true;
                }
                return val;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Change SARS submission file status .
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <param name="userName">User Name</param>
        /// <returns>true false</returns>
        public async Task<bool> SubmitSARSFile(int file_id, string userName)
        {
            try
            {
                bool val = false;
                string Query = "SP_UPDATE_SARS_SUBMISSION";
                DynamicParameters param = new DynamicParameters();
                param.Add("@file_id", file_id);
                param.Add("@username", userName);
                param.Add("@ACTION", "SUBMIT");
                param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
                var result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
                if (result > 0)
                {
                    val = true;
                }
                return val;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Change SARS submission file status .
        /// </summary>
        /// <param name="dtcorrespondenceData">List Of file id</param>
        /// <param name="userName">User Name</param>
        /// <returns>true false</returns>
        public async Task<bool> DeleteCorrespondence(DataTable dtcorrespondenceData, string userName)
        {
            try
            {
                bool val = false;
                string Query = "SP_UPDATE_SARS_SUBMISSION";
                DynamicParameters param = new DynamicParameters();
                param.Add("@dtcorrespondence", dtcorrespondenceData.AsTableValuedParameter());
                param.Add("@username", userName);
                param.Add("@ACTION", "D");
                param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
                var result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
                if (result > 0)
                {
                    val = true;
                }
                return val;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Generate SARS submission snapshot .
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <param name="fileRegionId">file Region Id</param>
        /// <param name="userName">User Name</param>
        /// <returns>true false</returns>
        public async Task<bool> GenerateSnapshot(int file_id, int fileRegionId, string userName)
        {
            try
            {
                bool val = false;
                string Query = "SP_GENERATE_SARS_SUBMISSION_SNAPSHOT";
                DynamicParameters param = new DynamicParameters();
                param.Add("@file_id", file_id);
                param.Add("@file_regionId", fileRegionId);
                param.Add("@username", userName);
                param.Add("@ACTION", "U");
                param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
                var result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
                if (result > 0)
                {
                    val = true;
                }
                return val;
            }
            catch (Exception)
            {
                throw;
            }
        }
        /// <summary>
        /// Get All the urle for button visibility in UI
        /// </summary>
        /// <returns></returns>
        public async Task<ActionRules> GetActionRules()
        {
            try
            {
                var actionRules = new ActionRules();
                string Query = "SP_GET_SARS_SUBMISSION_ACTION_RULE";
                DynamicParameters param = new DynamicParameters();
                param.Add("@ActionFor", "sarssbumission");
                var result = await Task.FromResult(_dapper.GetDataSet(Query, param, commandType: CommandType.StoredProcedure));

                foreach (DataRow row in result.Tables[0].Rows)
                {
                    actionRules.Promote = row["Promote"].ToString().Split(" ");
                    actionRules.Repromote = row["Repromote"].ToString().Split(" ");
                    actionRules.View_Error = row["View_Error"].ToString().Split(" ");
                    actionRules.View_Unpromoted_Data = row["View_Unpromoted_Data"].ToString().Split(" ");
                    actionRules.Generate_SARS_Snapshot = row["Generate_SARS_Snapshot"].ToString().Split(" ");
                    actionRules.View_Submission_Return_Report = row["View_Submission_Return_Report"].ToString().Split(" ");
                    actionRules.View_SARS_Submission = row["View_SARS_Submission"].ToString().Split(" ");
                    actionRules.View_file_overview = row["View_file_overview"].ToString().Split(" ");
                    actionRules.Submit_SARS_File = row["Submit_SARS_File"].ToString().Split(" ");
                    actionRules.Upload_E_Filing = row["Upload_E_Filing"].ToString().Split(" ");
                    actionRules.Delete = row["Delete"].ToString().Split(" ");
                    actionRules.Download = row["Download"].ToString().Split(" ");
                }
                return actionRules;
            }
            catch (Exception)
            {
                throw;
            }
        }

        
        /// <summary>
        /// Get Error data
        /// </summary>
        /// <param name="dtInputParams">Input params for proc in key value format</param>
        /// <param name="page">Page Index</param>
        /// <param name="size">No of record in a page</param>
        /// <returns>List Object</returns>
        public async Task<ViewError> ViewErrorReport(DataTable dtInputParams, int page, int size)
        {
            try
            {
                var viewError = new ViewError();
                string Query = "sp_view_sars_submission_error";
                DynamicParameters param = new DynamicParameters();
                param.Add("@Page", page);
                param.Add("@Size", size);
                param.Add("@input_params", dtInputParams.AsTableValuedParameter());
                var result = await Task.FromResult(_dapper.GetDataSet(Query, param, commandType: CommandType.StoredProcedure));
                
                var correspondenceDataTable = result.Tables[0];
                var correspondenceDataErrorHeaderTable = result.Tables[1];
                var correspondenceErrorDataTable = result.Tables[2];

                var correspondenceData = GetItem<CorrespondenceData>(correspondenceDataTable.Rows[0]);
                viewError.CorrespondenceData = correspondenceData;

                var correspondenceErrorHeaderData= ConvertDataTableToList<DataLoadErrorCol>(correspondenceDataErrorHeaderTable);
                viewError.CorrespondenceErrorHeaderData = correspondenceErrorHeaderData;

                var correspondenceErrorData = ConvertDataTableToList<CorrespondenceErrorData>(correspondenceErrorDataTable);
                viewError.CorrespondenceErrorData = correspondenceErrorData;
                return viewError;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Delete error record of SARS Submission
        /// </summary>
        /// <param name="dtcorrespondenceErrorData"></param>
        /// <param name="userName">User Name</param>
        /// <param name="fileType"></param>
        /// <returns></returns>
        public async Task<int> DeleteErrorRecord(DataTable dtcorrespondenceErrorData, string userName,string fileType)
        {
            try
            {
                int result = 0;
                string Query = "SP_Delete_correspondence_FileRecord";
                DynamicParameters param = new DynamicParameters();
                param.Add("@FileType", fileType);
                param.Add("@UserName", userName);
                param.Add("@DtcorrespondenceErrorData", dtcorrespondenceErrorData.AsTableValuedParameter());
                param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);

                result = await Task.FromResult(_dapper.Execute(Query, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }
        /// <summary>
        /// Conver table to list
        /// </summary>
        /// <typeparam name="T">Any Type</typeparam>
        /// <param name="dt">Data Table</param>
        /// <returns>List Object</returns>
        private List<T> ConvertDataTableToList<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetItem<T>(row);
                data.Add(item);
            }
            return data;
        }
        /// <summary>
        /// Get Object for each data row
        /// </summary>
        /// <typeparam name="T">Any Type</typeparam>
        /// <param name="dr">Data row</param>
        /// <returns>Object</returns>
        private T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in dr.Table.Columns)
            {
                foreach (PropertyInfo pro in temp.GetProperties())
                {
                    if (pro.Name == column.ColumnName)
                        pro.SetValue(obj, dr[column.ColumnName], null);
                    else
                        continue;
                }
            }
            return obj;
        }

    }
}
