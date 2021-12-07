using Microsoft.EntityFrameworkCore;

namespace OLDMutual.CTS.SnsNotification.Data.Dapper_ORM.DataContext
{
    public class AppContext : DbContext
    {
        public AppContext() { }
        public AppContext(DbContextOptions<AppContext> options) : base(options) { }
    }
}
