using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.Identity.Data.Interfaces;
using OLDMutual.CTS.Identity.Domain.Models;
using OLDMutual.CTS.Identity.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Identity.Service.Services
{
    public class SideDrawerMenuService : ISideDrawerMenuService
    {
        private readonly ISideDrawerMenu _sideDrawerMenu;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SideDrawerMenuService(ISideDrawerMenu sideDrawerMenu, IHttpContextAccessor httpContextAccessor)
        {
            _sideDrawerMenu = sideDrawerMenu;
            _httpContextAccessor = httpContextAccessor;
        }
        /*  
        .......................................................................................................
        * This is the GetSideBarMenuList function
        * GetSideBarMenuList is used to get side menu list of perticular user
        .......................................................................................................
        */
        public Menu GetSideBarMenuList()
        {
            var eMail = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
            var data = _sideDrawerMenu.GetSideBarMenuList(eMail);
            Menu m = new Menu();
            if (data.Any())
            {
                m.user_id = data.ToList()[0].user_id;
                m.user_name = data.ToList()[0].user_name;
                var userroles = data.Select(x => x.role_id).Distinct().ToList();
                m.ParentMenu = new List<SideBarParentMenu>();
                foreach (var roles in userroles)
                {
                    m.role_id = roles;
                    foreach (var Mdata in data.Where(x => x.role_id == roles).ToList())
                    {
                        SideBarParentMenu Pmenu = new SideBarParentMenu();
                        if ((!(m.ParentMenu.Any(x => x.module_id.ToString().Contains(Mdata.parent_module_id.ToString())))) && (!(m.ParentMenu.Any(x => x.ChiledMenu.Any(y => y.Module_id.ToString().Contains(Mdata.parent_module_id.ToString()))))))
                        {
                            Pmenu.role_id = Mdata.role_id;
                            Pmenu.module_id = Mdata.module_id;
                            Pmenu.module_name = Mdata.module_name;
                            Pmenu.image_name = Mdata.image_name;
                            Pmenu.isIcon = true;
                            Pmenu.route = Mdata.routes;
                            Pmenu.ChiledMenu = new List<SideBarChildMenu>();
                            foreach (var CMdata in data.Where(x => x.role_id == roles).ToList())
                            {
                                if (Mdata.module_id == CMdata.parent_module_id)
                                {
                                    SideBarChildMenu Cmenu = new SideBarChildMenu();
                                    Cmenu.Module_id = CMdata.module_id;
                                    Cmenu.module_name = CMdata.module_name;
                                    Cmenu.route = CMdata.routes;
                                    Cmenu.ChiledMenu = new List<SideBarChildMenu>();
                                    Cmenu.isChild = true;
                                    foreach (var CsMdata in data.Where(x => x.role_id == roles).ToList())
                                    {
                                        if (Cmenu.Module_id == CsMdata.parent_module_id)
                                        {
                                            SideBarChildMenu Csmenu = new SideBarChildMenu();
                                            Csmenu.Module_id = CsMdata.module_id;
                                            Csmenu.module_name = CsMdata.module_name;
                                            Csmenu.route = CsMdata.routes;
                                            Csmenu.isChild = true;
                                            Csmenu.isNestedChild = true;
                                            Cmenu.ChiledMenu.Add(Csmenu);
                                        }
                                    }
                                    Pmenu.ChiledMenu.Add(Cmenu);
                                }
                            }
                            m.ParentMenu.Add(Pmenu);
                        }
                    }
                }
                m.ParentMenu = m.ParentMenu.Count > 0 ? (from t in m.ParentMenu select t).OrderBy(c => c.module_id).ToList() : m.ParentMenu;

            }
            return m;
        }
    }
}
