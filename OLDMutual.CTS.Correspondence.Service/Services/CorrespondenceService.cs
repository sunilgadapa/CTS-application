using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.Correspondence.Data.Interfaces;
using OLDMutual.CTS.Correspondence.Domain.Models;
using OLDMutual.CTS.Correspondence.Service.Interfaces;

namespace OLDMutual.CTS.Correspondence.Service.Services
{

    public class CorrespondenceService : ICorrespondenceService
    {
        private readonly ICorrespondence _Correspondence;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public CorrespondenceService(ICorrespondence Correspondence, IHttpContextAccessor httpContextAccessor)
        {
            _Correspondence = Correspondence;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="type">Drop down Type</param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<DataLoadDropdown>> GETDropDownData(string type)
        {
            try
            {
                var result = await _Correspondence.GETDropDownData(type);
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Get SARS Submission Data
        /// </summary>
        /// <param name="data">Input params</param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<CorrespondenceData>> GetCorrespondenceData(CorrespondenceData data)
        {
            DataTable dtfileregiontype = new DataTable();
            dtfileregiontype.Columns.Add("ID", typeof(int));
            DataRow row;
            //if (data.fileregion_type != null && data.fileregion_type.Length > 0)
            //{
            //    for (int i = 0; i < data.fileregion_type.Length; i++)
            //    {
            //        row = dtfileregiontype.NewRow();
            //        row["ID"] = data.fileregion_type[i];
            //        dtfileregiontype.Rows.Add(row);
            //    }
            //}
            DataTable dtstatus = new DataTable();
            //dtstatus.Columns.Add("ID", typeof(int));
            //if (data.status_type != null && data.status_type.Length > 0)
            //{
            //    for (int i = 0; i < data.status_type.Length; i++)
            //    {
            //        row = dtstatus.NewRow();
            //        row["ID"] = data.status_type[i];
            //        dtstatus.Rows.Add(row);
            //    }
            //}

            DataTable dtfundentity = new DataTable();
            //dtfundentity.Columns.Add("ID", typeof(int));
            //if (data.fundentity_type != null && data.fundentity_type.Length > 0)
            //{
            //    for (int i = 0; i < data.fundentity_type.Length; i++)
            //    {
            //        row = dtfundentity.NewRow();
            //        row["ID"] = data.fundentity_type[i];
            //        dtfundentity.Rows.Add(row);
            //    }
            //}

            try
            {
                var result = await _Correspondence.GetCorrespondenceData(data, dtfileregiontype, dtstatus, dtfundentity);
                return result;
            }

            catch (Exception)
            {
                throw;
            }

        }

        /// <summary>
        /// Change SARS submission file status.
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <returns>true false</returns>
        public async Task<bool> PromoteCorrespondence(int file_id)
        {
            try
            {
                var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
                return await _Correspondence.PromoteCorrespondence(file_id, userName);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Change SARS submission file status.
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <returns>true false</returns>
        public async Task<bool> SubmitSARSFile(int file_id)
        {
            try
            {
                var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
                return await _Correspondence.SubmitSARSFile(file_id, userName);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Delete SARS submission file.
        /// </summary>
        /// <param name="CorrespondenceData">List of file id</param>
        /// <returns>true false</returns>
        public async Task<bool> DeleteCorrespondence(List<FileModel> CorrespondenceData)
        {
            try
            {
                var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
                DataTable dtCorrespondenceData = new DataTable();
                dtCorrespondenceData.Columns.Add("ID", typeof(int));
                DataRow row;
                for (int i = 0; i < CorrespondenceData.Count; i++)
                {
                    row = dtCorrespondenceData.NewRow();
                    row["ID"] = CorrespondenceData[i].Ids;
                    dtCorrespondenceData.Rows.Add(row);
                }
                return await _Correspondence.DeleteCorrespondence(dtCorrespondenceData, userName);
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
        /// <returns>true false</returns>
        public async Task<bool> GenerateSnapshot(int file_id, int fileRegionId)
        {
            try
            {
                var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
                return await _Correspondence.GenerateSnapshot(file_id, fileRegionId, userName);
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
                var result = await _Correspondence.GetActionRules();
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Get Error Report
        /// </summary>
        /// <param name="page">Page Index</param>
        /// <param name="size">No of record in a page</param>
        /// <param name="file_Id">File Id</param>
        /// <returns>List Object</returns>
        public async Task<ViewError> ViewErrorReport(int page,int size, int file_Id)
        {
            try
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
                var result = await _Correspondence.ViewErrorReport(dtInputParams,page,size);
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Delete sars submission error data
        /// </summary>
        /// <param name="CorrespondenceErrorData">Array of error file id</param>
        /// <param name="fileType">file Type</param>
        /// <returns></returns>
        public async Task<int> DeleteErrorRecord(List<FileModel> CorrespondenceErrorData,string fileType)
        {
            try
            {
                var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
                DataTable dtCorrespondenceData = new DataTable();
                dtCorrespondenceData.Columns.Add("ID", typeof(int));
                DataRow row;
                for (int i = 0; i < CorrespondenceErrorData.Count; i++)
                {
                    row = dtCorrespondenceData.NewRow();
                    row["ID"] = CorrespondenceErrorData[i].Ids;
                    dtCorrespondenceData.Rows.Add(row);
                }
                return await _Correspondence.DeleteErrorRecord(dtCorrespondenceData, userName, fileType);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
