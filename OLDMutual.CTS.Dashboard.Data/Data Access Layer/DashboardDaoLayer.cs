using Dapper;
using OLDMutual.CTS.Dashboard.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.Dashboard.Data.Interfaces;
using OLDMutual.CTS.Dashboard.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Dashboard.Data.Data_Access_Layer
{
    public class DashboardDaoLayer : IDashboardDao
    {
        private readonly IDapper _dapper;
        public DashboardDaoLayer(IDapper dapper)
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
        /*  
       .......................................................................................................
       * This is the GerDataLoadRecentErrors DAO method        
       * GerDataLoadRecentErrors() is used to get data load recent errors
       .......................................................................................................
       */
        public async Task<IEnumerable<DataloadRecentErrorsDto>> GetDataLoadRecentErrors(int PageNumber, int Size)
        {
            string sp = "SP_GetDataLoadRecentErrors";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Page", PageNumber);
            param.Add("@Size", Size);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            var result = await Task.FromResult(_dapper.GetAll<DataloadRecentErrorsDto>(sp, param, commandType: CommandType.StoredProcedure));
            result.ToList().ForEach(x => x.last_updated_date = x.last_updated_date != null ? Convert.ToDateTime(x.last_updated_date).ToString("yyyy/MM/dd HH:mm") : "NULL");
            int totalRecords = param.Get<int>("@RowsAffected");
            result.ToList().ForEach(x => x.totalItems = totalRecords);
            return result;
        }
    }
}

