using System.Collections.Generic;

namespace OLDMutual.CTS.Identity.Domain.Models
{
    public class Menu
    {
        public int user_id { get; set; }
        public string user_name { get; set; }
        public int role_id { get; set; }
        public int module_id { get; set; }
        public string module_name { get; set; }
        public int parent_module_id { get; set; }
        public string image_name { get; set; }
        public string routes { get; set; }
        public List<SideBarParentMenu> ParentMenu { get; set; }
    }
}
