using OLDMutual.CTS.Identity.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Identity.Data.Interfaces
{
    public interface ISideDrawerMenu:IDisposable
    {
        public IEnumerable<Menu> GetSideBarMenuList(string user_name);
    }
}
