using OLDMutual.CTS.DataSubmission.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace OLDMutual.CTS.DataSubmission.Data.Interfaces
{
    public interface IDataSubmission : IDisposable
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
        Task<IEnumerable<SarsSubmissionData>> GetSARSSubmissionData(SarsSubmissionData data, DataTable dtfileregiontype, DataTable dtstatus, DataTable dtfundentity);

        /// <summary>
        /// Change SARS submission file status .
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <param name="userName">User Name</param>
        /// <returns>true false</returns>
        Task<bool> PromoteSARSSubmission(SarsDataPromotion data, string userName);

        /// <summary>
        /// Change SARS submission file status .
        /// </summary>
        /// <param name="dtsarsSubmissionData">List Of file id</param>
        /// <param name="userName">User Name</param>
        /// <returns>true false</returns>
        Task<bool> DeleteSARSSubmission(DataTable dtsarsSubmissionData, string userName);

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
        /// Get Un Promoted data
        /// </summary>
        /// <param name="dtInputParams">Input params for proc in key value format</param>
        /// <param name="page">Page Index</param>
        /// <param name="size">No of record in a page</param>
        /// <returns>List Object</returns>
        Task<IEnumerable<ViewUnPromotedData>> ViewSarsUnPromotedData(DataTable dtInputParams, int page, int size);

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
        /// <param name="dtsarsSubmissionErrorData"></param>
        /// <param name="userName">User Name</param>
        /// <param name="fileType"></param>
        /// <returns></returns>
        Task<int> DeleteErrorRecord(DataTable dtsarsSubmissionErrorData, string userName, string fileType);
    }
}
