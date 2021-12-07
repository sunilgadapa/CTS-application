using Dapper;
using OLDMutual.CTS.Identity.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.Identity.Data.Interfaces;
using OLDMutual.CTS.Identity.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Identity.Data.Data_Access_Layer
{
    public class SideDrawerMenu : ISideDrawerMenu        
    {
        private readonly IDapper _dapper;

        public SideDrawerMenu(IDapper dapper)
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
        * This is the GetSideBarMenuList function
        * @param user_name is user name of user
        * GetSideBarMenuList is used to get side menu list of perticular user
        .......................................................................................................
        */
        public IEnumerable<Menu> GetSideBarMenuList(string user_name)
        {
                         
                string sp = "SP_GetMenuData";
                var param = new DynamicParameters();
                param.Add("@user_name", user_name);
                var result =  _dapper.GetAll<Menu>(sp, param, commandType: CommandType.StoredProcedure);
                return result;
           
        }
    }
}
