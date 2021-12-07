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

    public class CorrespondenceService : ICorrespondenceService
    {
        private readonly ICorrespondence _correspondence;
        
        public CorrespondenceService(ICorrespondence correspondence)
        {
            _correspondence = correspondence;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="type">Drop down Type</param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<DataLoadDropdown>> GetCorrespondenceDropdowndata(string type)
        {
            var result = await _correspondence.GetCorrespondenceDropdowndata(type);
            return result;
        }
        /// <summary>
        ///
        /// </summary>
        /// <param name="type">Drop down Type</param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<CorrespondenceDropdown>> GetCorrespondenceDropdownTypeEnv(string type)
        {
            var result = await _correspondence.GetCorrespondenceDropdownTypeEnv(type);
            return result;
        }
        /// <summary>
        /// Get Correspondence Data
        /// </summary>
        /// <param name="data">CorrespondenceData type</param>
        /// <returns>List Object</returns>
        public async Task<IEnumerable<CorrespondenceData>> GetCorrespondenceData(CorrespondenceData data)
        {
            DataTable dtbrand = new DataTable();
            dtbrand.Columns.Add("ID", typeof(int));
            DataRow row;
            if (data.brand != null && data.brand.Length > 0)
            {
                for (int i = 0; i < data.brand.Length; i++)
                {
                    row = dtbrand.NewRow();
                    row["ID"] = data.brand[i];
                    dtbrand.Rows.Add(row);
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

            DataTable dtcorrespondencetype = new DataTable();
            dtcorrespondencetype.Columns.Add("ID", typeof(string));
            if (data.correspondence_type != null && data.correspondence_type.Length > 0)
            {
                for (int i = 0; i < data.correspondence_type.Length; i++)
                {
                    row = dtcorrespondencetype.NewRow();
                    row["ID"] = data.correspondence_type[i];
                    dtcorrespondencetype.Rows.Add(row);
                }
            }

            DataTable dtenvironment = new DataTable();
            dtenvironment.Columns.Add("ID", typeof(string));
            if (data.environment != null && data.environment.Length > 0)
            {
                for (int i = 0; i < data.environment.Length; i++)
                {
                    row = dtenvironment.NewRow();
                    row["ID"] = data.environment[i];
                    dtenvironment.Rows.Add(row);
                }
            }
            return await _correspondence.GetCorrespondenceData(data, dtbrand, dtstatus, dtcorrespondencetype, dtenvironment);            
        }
    }
}
