using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using OLDMutual.CTS.Reporting.Shared.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;

namespace OLDMutual.CTS.Reporting.Data.Dapper_ORM.Dapper
{
    public class Dapperr : IDapper
    {        
        private readonly IConfigurationSettings _configurationSettings;
        public Dapperr(IConfigurationSettings configurationSettings)
        {            
            _configurationSettings = configurationSettings;
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
       * This is the Execute Dapper method    
       * @param sp is used to pass stored procedure name
       * @param outputParameterName is used to specify output parameter name
       * @param parms is used to pass input parameter names
       * @param commandType is user to specify command type as stored procedure
       * Execute() is used for insert and updated DML operations
       .......................................................................................................
       */
        public int Execute(string sp, string outputParameterName, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {

            int val = 0;
            var builder = _configurationSettings.GetConnectionString();
            using IDbConnection db = new SqlConnection(builder.ConnectionString);
            try
            {
                if (db.State == ConnectionState.Closed)
                    db.Open();

                using var tran = db.BeginTransaction();
                try
                {
                    var result = db.Query(sp, parms, commandType: commandType, transaction: tran).ToList().Count;
                    if (string.IsNullOrEmpty(outputParameterName))
                    {
                        
                        val = result;
                    }
                    else
                    {
                        val = parms.Get<int>(outputParameterName);
                    }
                    tran.Commit();
                }
                catch 
                {
                    tran.Rollback();
                    throw;
                }
            }
            catch 
            {
                db.Close();
                throw;
            }
            finally
            {
                if (db.State == ConnectionState.Open)
                    db.Close();
            }

            return val;
        }
        /*  
       .......................................................................................................
       * This is the Get Dapper method    
       * @param sp is used to pass stored procedure name       
       * @param parms is used to pass input parameter names
       * @param commandType is user to specify command type as stored procedure
       * Get() is used to get single record from the database
       .......................................................................................................
       */
        public T Get<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            var builder = _configurationSettings.GetConnectionString();
            using IDbConnection db = new SqlConnection(builder.ConnectionString);
            return db.Query<T>(sp, parms, commandType: commandType).FirstOrDefault();
        }
        /*  
       .......................................................................................................
       * This is the GetAll Dapper method    
       * @param sp is used to pass stored procedure name       
       * @param parms is used to pass input parameter names
       * @param commandType is user to specify command type as stored procedure
       * GetAll() is used to get more than one records from the database
       .......................................................................................................
       */
        public IEnumerable<T> GetAll<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            var builder = _configurationSettings.GetConnectionString();
            using IDbConnection db = new SqlConnection(builder.ConnectionString);
            if(parms==null)
            {
                return db.Query<T>(sp, commandType: commandType).ToList();
            }
            return db.Query<T>(sp, parms, commandType: commandType).ToList();
        }
        /*  
      .......................................................................................................
      * This is the GetDbconnection Dapper method           
      * GetDbconnection() is used to get new sql connection for given connection string
      .......................................................................................................
      */
        public DbConnection GetDbconnection()
        {
            var builder = _configurationSettings.GetConnectionString();
            return new SqlConnection(builder.ConnectionString);
        }
        /*  
       .......................................................................................................
       * This is the InsertUpdate Dapper method    
       * @param sp is used to pass stored procedure name       
       * @param parms is used to pass input parameter names
       * @param commandType is user to specify command type as stored procedure
       * InsertUpdate() is used to insert or update the records in the database
       .......................................................................................................
       */
        public T InsertUpdate<T>(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            T result;
            var builder = _configurationSettings.GetConnectionString();
            using IDbConnection db = new SqlConnection(builder.ConnectionString);
            try
            {
                if (db.State == ConnectionState.Closed)
                    db.Open();

                using var tran = db.BeginTransaction();
                try
                {
                    result = db.Query<T>(sp, parms, commandType: commandType, transaction: tran).FirstOrDefault();
                    tran.Commit();
                }
                catch
                {
                    tran.Rollback();
                    throw;
                }
            }
            catch 
            {
                db.Close();
                throw;
            }
            finally
            {
                if (db.State == ConnectionState.Open)
                    db.Close();
            }

            return result;
        }
    }
}
