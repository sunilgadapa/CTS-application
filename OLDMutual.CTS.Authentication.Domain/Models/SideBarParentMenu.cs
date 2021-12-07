using System.Collections.Generic;

namespace OLDMutual.CTS.Identity.Domain.Models
{
    public class SideBarParentMenu
    {
        public int role_id { get; set; }
        public int module_id { get; set; }
        public string module_name { get; set; }
        public bool isIcon { get; set; }
        public string image_name { get; set; }
        public string route { get; set; }
        public List<SideBarChildMenu> ChiledMenu { get; set; }
    }
}
