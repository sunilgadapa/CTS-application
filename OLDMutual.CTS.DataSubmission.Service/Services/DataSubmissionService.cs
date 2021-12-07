using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.DataSubmission.Data.Interfaces;
using OLDMutual.CTS.DataSubmission.Domain.Models;
using OLDMutual.CTS.DataSubmission.Service.Interfaces;

namespace OLDMutual.CTS.DataSubmission.Service.Services
{

    public class DataSubmissionService : IDataSubmissionService
    {
        private readonly IDataSubmission _dataSubmission;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public DataSubmissionService(IDataSubmission dataSubmission, IHttpContextAccessor httpContextAccessor)
        {
            _dataSubmission = dataSubmission;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="type">Drop down Type</param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<DataLoadDropdown>> GETDropDownData(string type)
        {
            var result = await _dataSubmission.GETDropDownData(type);
            return result;
        }

        /// <summary>
        /// Get SARS Submission Data
        /// </summary>
        /// <param name="data">Input params</param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<SarsSubmissionData>> GetSARSSubmissionData(SarsSubmissionData data)
        {
            DataTable dtfileregiontype = new DataTable();
            dtfileregiontype.Columns.Add("ID", typeof(int));
            DataRow row;
            if (data.fileregion_type != null && data.fileregion_type.Length > 0)
            {
                for (int i = 0; i < data.fileregion_type.Length; i++)
                {
                    row = dtfileregiontype.NewRow();
                    row["ID"] = data.fileregion_type[i];
                    dtfileregiontype.Rows.Add(row);
                }
            }
            DataTable dtstatus = new DataTable();
            dtstatus.Columns.Add("ID", typeof(int));
            if (data.status_type != null && data.status_type.Length > 0)
            {
                for (int i = 0; i < data.status_type.Length; i++)
                {
                    row = dtstatus.NewRow();
                    row["ID"] = data.status_type[i];
                    dtstatus.Rows.Add(row);
                }
            }

            DataTable dtfundentity = new DataTable();
            dtfundentity.Columns.Add("ID", typeof(int));
            if (data.fundentity_type != null && data.fundentity_type.Length > 0)
            {
                for (int i = 0; i < data.fundentity_type.Length; i++)
                {
                    row = dtfundentity.NewRow();
                    row["ID"] = data.fundentity_type[i];
                    dtfundentity.Rows.Add(row);
                }
            }

            var result = await _dataSubmission.GetSARSSubmissionData(data, dtfileregiontype, dtstatus, dtfundentity);
            return result;
        }

        /// <summary>
        /// Change SARS submission file status.
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <returns>true false</returns>
        public async Task<bool> PromoteSARSSubmission(SarsDataPromotion data)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _dataSubmission.PromoteSARSSubmission(data, userName);
        }

        /// <summary>
        /// Change SARS submission file status.
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <returns>true false</returns>
        public async Task<bool> SubmitSARSFile(int file_id)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _dataSubmission.SubmitSARSFile(file_id, userName);
        }

        /// <summary>
        /// Delete SARS submission file.
        /// </summary>
        /// <param name="sarsSubmissionData">List of file id</param>
        /// <returns>true false</returns>
        public async Task<bool> DeleteSARSSubmission(List<FileModel> sarsSubmissionData)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            DataTable dtSarsSubmissionData = new DataTable();
            dtSarsSubmissionData.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < sarsSubmissionData.Count; i++)
            {
                row = dtSarsSubmissionData.NewRow();
                row["ID"] = sarsSubmissionData[i].Ids;
                dtSarsSubmissionData.Rows.Add(row);
            }
            return await _dataSubmission.DeleteSARSSubmission(dtSarsSubmissionData, userName);
        }


        /// <summary>
        /// Generate SARS submission snapshot .
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <param name="fileRegionId">file Region Id</param>
        /// <returns>true false</returns>
        public async Task<bool> GenerateSnapshot(int file_id, int fileRegionId)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _dataSubmission.GenerateSnapshot(file_id, fileRegionId, userName);
        }

        /// <summary>
        /// Get All the urle for button visibility in UI
        /// </summary>
        /// <returns></returns>
        public async Task<ActionRules> GetActionRules()
        {
            var result = await _dataSubmission.GetActionRules();
            return result;
        }

        /// <summary>
        /// Get Error Report
        /// </summary>
        /// <param name="page">Page Index</param>
        /// <param name="size">No of record in a page</param>
        /// <param name="file_Id">File Id</param>
        /// <returns>List Object</returns>
        public async Task<ViewError> ViewErrorReport(int page, int size, int file_Id)
        {
            //Add Data into table once finalize the input param
            DataTable dtInputParams = new DataTable();
            dtInputParams.Columns.Add("Key", typeof(string));
            dtInputParams.Columns.Add("Value", typeof(string));
            DataRow row;
            row = dtInputParams.NewRow();
            row["Key"] = "sars_submission_id";
            row["Value"] = file_Id;
            dtInputParams.Rows.Add(row);
            var result = await _dataSubmission.ViewErrorReport(dtInputParams, page, size);
            return result;
        }

        /// <summary>
        /// Delete sars submission error data
        /// </summary>
        /// <param name="sarsSubmissionErrorData">Array of error file id</param>
        /// <param name="fileType">file Type</param>
        /// <returns></returns>
        public async Task<int> DeleteErrorRecord(List<FileModel> sarsSubmissionErrorData, string fileType)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            DataTable dtSarsSubmissionData = new DataTable();
            dtSarsSubmissionData.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < sarsSubmissionErrorData.Count; i++)
            {
                row = dtSarsSubmissionData.NewRow();
                row["ID"] = sarsSubmissionErrorData[i].Ids;
                dtSarsSubmissionData.Rows.Add(row);
            }
            return await _dataSubmission.DeleteErrorRecord(dtSarsSubmissionData, userName, fileType);
        }
        /// <summary>
        /// Get Un Promoted data
        /// </summary>
        /// <param name="page">Page Index</param>
        /// <param name="size">No of record in a page</param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<ViewUnPromotedData>> ViewSarsUnPromotedData(int page, int size)
        {
            //Add Data into table once finalize the input param
            DataTable dtInputParams = new DataTable();
            var result = await _dataSubmission.ViewSarsUnPromotedData(dtInputParams, page, size);
            return result;
        }
    }
}
