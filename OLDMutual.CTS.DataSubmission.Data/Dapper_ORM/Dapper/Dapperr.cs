using Dapper;
using OLDMutual.CTS.DataSubmission.Shared.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;

namespace OLDMutual.CTS.DataSubmission.Data.Dapper_ORM.Dapper
{
    public class Dapperr : IDapper
    {
        private readonly SqlConnectionStringBuilder builder;

        public Dapperr(IConfigurationSettings configurationSettings)
        {
            IConfigurationSettings _configurationSettings;
            _configurationSettings = configurationSettings;
            builder = _configurationSettings.GetConnectionString();
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
            using IDbConnection db = new SqlConnection(builder.ConnectionString);
            try
            {
                if (db.State == ConnectionState.Closed)
                    db.Open();

                using var tran = db.BeginTransaction();
                try
                {
                    if (string.IsNullOrEmpty(outputParameterName))
                    {
                        var result = db.Query(sp, parms, commandType: commandType, transaction: tran, commandTimeout: 0).ToList().Count;
                        val = result;
                    }
                    else
                    {
                        var result = db.Query(sp, parms, commandType: commandType, transaction: tran, commandTimeout: 0).FirstOrDefault();
                        val = parms.Get<int>(outputParameterName);
                    }
                    tran.Commit();
                }
                catch (Exception ex)
                {
                    tran.Rollback();
                    throw ex.InnerException;
                }
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
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
            using IDbConnection db = new SqlConnection(builder.ConnectionString);

            if (parms == null)
            {
                return db.Query<T>(sp, commandType: commandType, commandTimeout: 0).ToList();
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
                catch (Exception ex)
                {
                    tran.Rollback();
                    throw ex.InnerException;
                }
            }
            catch (Exception ex)
            {
                throw ex.InnerException;
            }
            finally
            {
                if (db.State == ConnectionState.Open)
                    db.Close();
            }

            return result;
        }
        /*  
     .......................................................................................................
     * This is the GetDataSet Dapper method    
     * @param sp is used to pass stored procedure name       
     * @param parms is used to pass input parameter names
     * @param commandType is user to specify command type as stored procedure
     * GetDataSet() is used to get dataset from the database
     .......................................................................................................
     */
        public DataSet GetDataSet(string sp, DynamicParameters parms, CommandType commandType = CommandType.StoredProcedure)
        {
            using IDbConnection db = new SqlConnection(builder.ConnectionString);
            var list = db.ExecuteReader(sp, parms, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        private DataSet ConvertDataReaderToDataSet(IDataReader data)
        {
            DataSet ds = new DataSet();
            int i = 0;
            while (!data.IsClosed)
            {
                ds.Tables.Add("Table" + (i + 1));
                ds.EnforceConstraints = false;
                ds.Tables[i].Load(data);
                i++;
            }
            return ds;
        }
    }
}
