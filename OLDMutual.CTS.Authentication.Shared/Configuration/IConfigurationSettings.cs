using System.Data.SqlClient;

namespace OLDMutual.CTS.Identity.Shared.Configuration
{
    public interface IConfigurationSettings
    {
        SqlConnectionStringBuilder GetConnectionString();
    }
}
