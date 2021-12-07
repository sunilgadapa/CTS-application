using OLDMutual.CTS.DataSubmission.Domain.Models;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;


namespace OLDMutual.CTS.DataSubmission.Service.Interfaces
{
    public interface ICorrespondenceService
    {
        /// <summary>
        /// Get Dropdown value
        /// </summary>
        /// <param name="type">Dropdown Type</param>
        /// <returns>List Object</returns>
        Task<IEnumerable<DataLoadDropdown>> GetCorrespondenceDropdowndata(string type);
        /// <summary>
        /// Get Dropdown value
        /// </summary>
        /// <param name="type">Dropdown Type</param>
        /// <returns>List Object</returns>
        Task<IEnumerable<CorrespondenceDropdown>> GetCorrespondenceDropdownTypeEnv(string type);
        /// <summary>
        /// Get Correspondence Data
        /// </summary>
        /// <param name="data">CorrespondenceData type</param>
        /// <returns>List Object</returns>
        Task<IEnumerable<CorrespondenceData>> GetCorrespondenceData(CorrespondenceData data);

    }
}
