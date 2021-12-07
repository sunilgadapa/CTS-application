using Microsoft.EntityFrameworkCore;

namespace OLDMutual.CTS.Correspondence.Data.Dapper_ORM.DataContext
{
    public class AppContext : DbContext
    {
        public AppContext() { }
        public AppContext(DbContextOptions<AppContext> options) : base(options) { }
    }
}
