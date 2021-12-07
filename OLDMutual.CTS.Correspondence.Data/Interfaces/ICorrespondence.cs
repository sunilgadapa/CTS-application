using OLDMutual.CTS.Correspondence.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Correspondence.Data.Interfaces
{
    public interface ICorrespondence : IDisposable
    {
        /// <summary>
        /// Get Drop Down Value
        /// </summary>
        /// <param name="type"></param>
        /// <returns>List Object</returns>
        Task<IEnumerable<DataLoadDropdown>> GETDropDownData(string type);
        /// <summary>
        /// Get SARS Submission Data
        /// </summary>
        /// <param name="data"></param>
        /// <param name="dtfileregiontype"></param>
        /// <param name="dtstatus"></param>
        /// <param name="dtfundentity"></param>
        /// <returns>List Object</returns>
        Task<IEnumerable<CorrespondenceData>> GetCorrespondenceData(CorrespondenceData data, DataTable dtfileregiontype, DataTable dtstatus, DataTable dtfundentity);

        /// <summary>
        /// Change SARS submission file status .
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <param name="userName">User Name</param>
        /// <returns>true false</returns>
        Task<bool> PromoteCorrespondence(int file_id, string userName);

        /// <summary>
        /// Change SARS submission file status .
        /// </summary>
        /// <param name="dtCorrespondenceData">List Of file id</param>
        /// <param name="userName">User Name</param>
        /// <returns>true false</returns>
        Task<bool> DeleteCorrespondence(DataTable dtCorrespondenceData, string userName);

        /// <summary>
        /// Generate SARS submission snapshot .
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <param name="fileRegionId">file Region Id</param>
        /// <param name="userName">User Name</param>
        /// <returns>true false</returns>
        Task<bool> GenerateSnapshot(int file_id, int fileRegionId, string userName);
        /// <summary>
        /// Get All the urle for button visibility in UI
        /// </summary>
        /// <returns></returns>
        Task<ActionRules> GetActionRules();

        /// <summary>
        /// Get Error Data
        /// </summary>
        /// <param name="dtInputParams">Input params for proc in key value format</param>
        /// <param name="page">Page Index</param>
        /// <param name="size">No of record in a page</param>
        /// <returns>List Object</returns>
        Task<ViewError> ViewErrorReport(DataTable dtInputParams, int page, int size);

        /// <summary>
        /// Change SARS submission file status .
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <param name="userName">User Name</param>
        /// <returns>true false</returns>
        Task<bool> SubmitSARSFile(int file_id, string userName);

        /// <summary>
        /// Delete error record of SARS Submission
        /// </summary>
        /// <param name="dtCorrespondenceErrorData"></param>
        /// <param name="userName">User Name</param>
        /// <param name="fileType"></param>
        /// <returns></returns>
        Task<int> DeleteErrorRecord(DataTable dtCorrespondenceErrorData, string userName, string fileType);
    }
}
