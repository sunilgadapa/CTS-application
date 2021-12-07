using Dapper;
using OLDMutual.CTS.Identity.Data.Interfaces;
using OLDMutual.CTS.Identity.Domain.Models;
using OLDMutual.CTS.Identity.Data.Dapper_ORM.Dapper;
using System;
using System.Data;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Identity.Data.Data_Access_Layer
{
    public class AccountManager : IAccountManager
    {
        private readonly IDapper _dapper;
        public AccountManager(IDapper dapper)
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
        * This is the IsValidAzureActiveDirectoryUser function
        * @param eMail is email id of entred user
        * IsValidAzureActiveDirectoryUser is used to check wheather the user is present in AD or not
        .......................................................................................................
        */
        public async Task<UserLogin> IsValidAzureActiveDirectoryUser(string eMail)
        {

            var resultdata = new UserLogin();
            resultdata.Onboarded = false;
            string sp = "SP_InsertLoginUser";
            var parms = new DynamicParameters();
            parms.Add("email", eMail);
            parms.Add("NEWID", dbType: DbType.Int32, direction: ParameterDirection.Output);
            resultdata = await Task.FromResult(_dapper.Get<UserLogin>(sp, parms, commandType: CommandType.StoredProcedure));
            if (resultdata == null)
            {
                resultdata = new UserLogin();
            }
            int newID = parms.Get<int>("NEWID");
            if (newID != 0)
            {
                resultdata.Onboarded = true;

            }
            return resultdata;

        }
    }
}
