using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Identity.Domain.Models
{
    public class SideBarChildMenu
    {
        public int Module_id { get; set; }
        public string module_name { get; set; }
        public int Parent_ModuleId { get; set; }
        public string route { get; set; }
        public bool isChild { get; set; }
        public bool isNestedChild { get; set; }
        public List<SideBarChildMenu> ChiledMenu { get; set; }
    }
}
