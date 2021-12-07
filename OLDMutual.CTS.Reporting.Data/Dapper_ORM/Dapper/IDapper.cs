using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

namespace OLDMutual.CTS.Reporting.Data.Dapper_ORM.Dapper
{
    public interface IDapper : IDisposable
    {
        DbConnection GetDbconnection();
        T Get<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        IEnumerable<T> GetAll<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        int Execute(string sp, string outputParameterName, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
        T InsertUpdate<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure);
    }
}
