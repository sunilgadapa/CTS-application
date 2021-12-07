using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.Identity.Domain.Models
{
    public class UserLogin
    {
        public int? ID { get; set; }     
        public string User { get; set; }       
        public string UserName { get; set; }
        public string Password { get; set; }
        public string token { get; set; }
        public DateTime? LoginTime { get; set; }
        public bool status_flag { get; set; }
        public string Email { get; set; }
        public string MobileNo { get; set; }
        public bool Onboarded { get; set; }
        public string routes { get; set; }
        public string role_id { get; set; }
        public string contextdata { get; set; }
        public object contextalldata { get; set; }
    }
}
