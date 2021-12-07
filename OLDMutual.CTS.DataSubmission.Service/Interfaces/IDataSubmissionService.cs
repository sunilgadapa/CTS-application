using OLDMutual.CTS.DataSubmission.Domain.Models;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;


namespace OLDMutual.CTS.DataSubmission.Service.Interfaces
{
    public interface IDataSubmissionService
    {
        /// <summary>
        /// Get Dropdown value
        /// </summary>
        /// <param name="type">Dropdown Type</param>
        /// <returns>List Object</returns>
        Task<IEnumerable<DataLoadDropdown>> GETDropDownData(string type);
        /// <summary>
        /// Get SARS Submission Data
        /// </summary>
        /// <param name="data">Input params</param>
        /// <returns>List Object</returns>
        Task<IEnumerable<SarsSubmissionData>> GetSARSSubmissionData(SarsSubmissionData data);

        /// <summary>
        /// Change SARS submission file status.
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <returns>true false</returns>
        Task<bool> PromoteSARSSubmission(SarsDataPromotion data);

        /// <summary>
        /// Delete SARS submission file.
        /// </summary>
        /// <param name="sarsSubmissionData">List of file id</param>
        /// <returns>true false</returns>
        Task<bool> DeleteSARSSubmission(List<FileModel> sarsSubmissionData);

        /// <summary>
        /// Change SARS submission file status.
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <returns>true false</returns>
        Task<bool> SubmitSARSFile(int file_id);

        /// <summary>
        /// Generate SARS submission snapshot .
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <param name="fileRegionId">file Region Id</param>
        /// <returns>true false</returns>
        Task<bool> GenerateSnapshot(int file_id, int fileRegionId);

        /// <summary>
        /// Get All the urle for button visibility in UI
        /// </summary>
        /// <returns></returns>
        Task<ActionRules> GetActionRules();

        /// <summary>
        /// Get SARS Unpromoted data
        /// </summary>
        /// <param name="dtInputParams">Input params for proc in key value format</param>
        /// <param name="page">Page Index</param>
        /// <param name="size">No of record in a page</param>
        /// <returns>List Object</returns>
        Task<IEnumerable<ViewUnPromotedData>> ViewSarsUnPromotedData(int page, int size);

        /// <summary>
        /// Get Error Report
        /// </summary>
        /// <param name="page">Page Index</param>
        /// <param name="size">No of record in a page</param>
        /// <param name="file_Id">File Id</param>
        /// <returns>List Object</returns>
        Task<ViewError> ViewErrorReport(int page, int size, int file_Id);
        /// <summary>
        /// Delete sars submission error data
        /// </summary>
        /// <param name="sarsSubmissionErrorData">Array of error file id</param>
        /// <param name="fileType">file Type</param>
        /// <returns></returns>
        Task<int> DeleteErrorRecord(List<FileModel> sarsSubmissionErrorData, string fileType);
    }
}
