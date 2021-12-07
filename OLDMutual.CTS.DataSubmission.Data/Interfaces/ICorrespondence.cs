using OLDMutual.CTS.DataSubmission.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace OLDMutual.CTS.DataSubmission.Data.Interfaces
{
    public interface ICorrespondence : IDisposable
    {
        /// <summary>
        /// Get Drop Down Value
        /// </summary>
        /// <param name="type"></param>
        /// <returns>List Object</returns>
        Task<IEnumerable<DataLoadDropdown>> GetCorrespondenceDropdowndata(string type);

        /// <summary>
        /// Get Drop Down Value
        /// </summary>
        /// <param name="type"></param>
        /// <returns>List Object</returns>
        Task<IEnumerable<CorrespondenceDropdown>> GetCorrespondenceDropdownTypeEnv(string type);

        /// <summary>
        /// Get Correspondence Data
        /// </summary>
        /// <param name="data"></param>
        /// <param name="dtbrand"></param>
        /// <param name="dtstatus"></param>
        /// <param name="dtcorrespondencetype"></param>
        ///  /// <param name="dtenvironment"></param>
        /// <returns>List Object</returns>
        Task<IEnumerable<CorrespondenceData>> GetCorrespondenceData(CorrespondenceData data, DataTable dtbrand, DataTable dtstatus, DataTable dtcorrespondencetype,DataTable dtenvironment);
                
    }
}
