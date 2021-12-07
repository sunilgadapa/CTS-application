using OLDMutual.CTS.Correspondence.Domain.Models;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;


namespace OLDMutual.CTS.Correspondence.Service.Interfaces
{
    public interface ICorrespondenceService
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
        Task<IEnumerable<CorrespondenceData>> GetCorrespondenceData(CorrespondenceData data);

        /// <summary>
        /// Change SARS submission file status.
        /// </summary>
        /// <param name="file_id">file id</param>
        /// <returns>true false</returns>
        Task<bool> PromoteCorrespondence(int file_id);

        /// <summary>
        /// Delete SARS submission file.
        /// </summary>
        /// <param name="CorrespondenceData">List of file id</param>
        /// <returns>true false</returns>
        Task<bool> DeleteCorrespondence(List<FileModel> CorrespondenceData);

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
        /// <param name="CorrespondenceErrorData">Array of error file id</param>
        /// <param name="fileType">file Type</param>
        /// <returns></returns>
        Task<int> DeleteErrorRecord(List<FileModel> CorrespondenceErrorData, string fileType);
    }
}
