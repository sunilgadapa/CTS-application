using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Dashboard.Domain.Models
{
    public class DataloadRecentErrorsDto
    {
        public string SOURCE_SYSTEM { get; set; }
        public string FILE_NAME { get; set; }
        public string DISPLAY_STATUS { get; set; }
        public string last_updated_date { get; set; }
        public int totalItems { get; set; }
    }
}
