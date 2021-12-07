namespace OLDMutual.CTS.UserManagement.Domain.Models
{
    public class SearchUsersDto
    {
        public string SearchText { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }
        public string Status { get; set; }
    }
}
