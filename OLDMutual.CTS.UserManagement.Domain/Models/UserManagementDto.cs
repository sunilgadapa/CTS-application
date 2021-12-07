using System;

namespace OLDMutual.CTS.UserManagement.Domain.Models
{
    public class UserManagementDto
    {
        public string UserId { get; set; }
        public int UserRoleId { get; set; }
        public string GivenName { get; set; }
        public int[] RoleId { get; set; }
        public int[] TaxModuleId { get; set; }
        public int[] LookupEntities { get; set; }
        public int[] FundEntityId { get; set; }
        public int[] BrandId { get; set; }
        public string UserName { get; set; }
        public string User { get; set; }
        public bool status_flag { get; set; }
        public string Email { get; set; }
        public DateTime DateOfExpiry { get; set; }
        public string RolesIds { get; set; }
        public string RoleNames { get; set; }
        public string TaxIds { get; set; }
        public string TaxNames { get; set; }
        public string SrcSymIds { get; set; }
        public string SrcSymNames { get; set; }
        public string FundEntityIds { get; set; }
        public string FundEntityNames { get; set; }
        public string BrandIds { get; set; }
        public string BrandNames { get; set; }
        public string[] strRoleNames { get; set; }
        public string[] strSrcSyms { get; set; }
        public string[] strFundEntities { get; set; }
        public int RowsAffected { get; set; }
        public string UserStatus { get; set; }

    }
}
