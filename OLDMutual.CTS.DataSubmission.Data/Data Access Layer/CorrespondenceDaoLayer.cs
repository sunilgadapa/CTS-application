using Dapper;
using OLDMutual.CTS.DataSubmission.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.DataSubmission.Data.Interfaces;
using OLDMutual.CTS.DataSubmission.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace OLDMutual.CTS.DataSubmission.Data.Data_Access_Layer
{
    /// <summary>
    /// Data submission DAO Class
    /// </summary>
    public class CorrespondenceDaoLayer : ICorrespondence
    {
        private readonly IDapper _dapper;
        public CorrespondenceDaoLayer(IDapper dapper)
        {
            _dapper = dapper;
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
        /// <summary>
        /// Get Drop Down Value
        /// </summary>
        /// <param name="type"></param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<DataLoadDropdown>> GetCorrespondenceDropdowndata(string type)
        {
            string Query = "SP_GetCorrespondenceDropdown";
            DynamicParameters param = new DynamicParameters();
            param.Add("@type", type);

            var result = await Task.FromResult(_dapper.GetAll<DataLoadDropdown>(Query, param, commandType: CommandType.StoredProcedure));
            result = result.ToList();
            return result;
        }

        /// <summary>
        /// Get Drop Down Value
        /// </summary>
        /// <param name="type"></param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<CorrespondenceDropdown>> GetCorrespondenceDropdownTypeEnv(string type)
        {
            string Query = "SP_GetCorrespondenceDropdownTypeEnv";
            DynamicParameters param = new DynamicParameters();
            param.Add("@type", type);

            var result = await Task.FromResult(_dapper.GetAll<CorrespondenceDropdown>(Query, param, commandType: CommandType.StoredProcedure));
            result = result.ToList();
            return result;
        }
        /// <summary>
        /// Get SARS Submission Data
        /// </summary>
        /// <param name="data"></param>
        /// <param name="dtbrand"></param>
        /// <param name="dtstatus"></param>
        /// <param name="dtcorrespondencetype"></param>
        /// /// <param name="dtenvironment"></param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<CorrespondenceData>> GetCorrespondenceData(CorrespondenceData data, DataTable dtbrand, DataTable dtstatus, DataTable dtcorrespondencetype, DataTable dtenvironment)
        {
            string Query = "USP_GetCorrespondenceData";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Page", data.Page);
            param.Add("@Size", data.Size);
            param.Add("@searchtext", data.searchtext);
            param.Add("@i_tax_type_id", data.tax_type_id);
            param.Add("@i_tax_period_id", data.tax_period_id);
            param.Add("@status_type", dtstatus.AsTableValuedParameter());
            param.Add("@correspondence_type", dtcorrespondencetype.AsTableValuedParameter());
            param.Add("@brand", dtbrand.AsTableValuedParameter());
            param.Add("@env", dtenvironment.AsTableValuedParameter());
            var result = await Task.FromResult(_dapper.GetAll<CorrespondenceData>(Query, param, commandType: CommandType.StoredProcedure));
            return result;
        }
                
    }
}
